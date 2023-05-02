import { SyntaxNode } from '@lezer/common';
import {
  Expr,
  FunctionCallArgs,
  FunctionCallBody,
  FunctionIdentifier,
  NumberLiteral,
  StringLiteral,
} from '@prometheus-io/lezer-promql';

import { getString } from './common-utils';
import { handleExpression } from './expression';
import { VisualizeContext, VisualizeQueryOperation } from './types';

export const updateFunctionArgs = (
  expr: string,
  node: SyntaxNode | null,
  context: VisualizeContext,
  operation: VisualizeQueryOperation,
): void => {
  if (!node) {
    return;
  }
  switch (node.type.id) {
    // In case we have an expression we don't know what kind so we have to look at the child as it can be anything.
    case Expr:
    // FunctionCallArgs are nested bit weirdly as mentioned so we have to go one deeper in this case.
    case FunctionCallArgs: {
      let child = node.firstChild;
      while (child) {
        updateFunctionArgs(expr, child, context, operation);
        child = child.nextSibling;
      }
      break;
    }

    case NumberLiteral: {
      operation.params.push(parseFloat(getString(expr, node)));
      break;
    }

    case StringLiteral: {
      operation.params.push(getString(expr, node).replace(/"/g, ''));
      break;
    }

    default: {
      handleExpression(expr, node, context);
    }
  }
};

const rangeFunctions = ['changes', 'rate', 'irate', 'increase', 'delta'];

export const handleFunction = (
  expr: string,
  node: SyntaxNode,
  context: VisualizeContext,
): void => {
  const visQuery = context.query;
  const nameNode = node.getChild(FunctionIdentifier);
  const funcName = getString(expr, nameNode);

  const body = node.getChild(FunctionCallBody);
  const callArgs = body!.getChild(FunctionCallArgs);
  const params = [];
  let interval = '';

  // This is a bit of a shortcut to get the interval argument. Reasons are
  // - interval is not part of the function args per promQL grammar but we model it as argument for the function in
  //   the query model.
  // - it is easier to handle template variables this way as template variable is an error for the parser
  if (rangeFunctions.includes(funcName) || funcName.endsWith('_over_time')) {
    const match = getString(expr, node).match(/\[(.+)\]/);
    if (match?.[1]) {
      interval = match[1];
      params.push(match[1]);
    }
  }

  const op = { id: funcName, params };
  // We unshift operations to keep the more natural order that we want to have in the visual query editor.
  visQuery.operations.unshift(op);

  if (callArgs) {
    if (getString(expr, callArgs) === interval + ']') {
      // This is a special case where we have a function with a single argument and it is the interval.
      // This happens when you start adding operations in query builder and did not set a metric yet.
      return;
    }
    updateFunctionArgs(expr, callArgs, context, op);
  }
};
