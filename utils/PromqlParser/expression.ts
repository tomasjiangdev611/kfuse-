import { SyntaxNode } from '@lezer/common';
import {
  AggregateExpr,
  BinaryExpr,
  Expr,
  FunctionCall,
  LabelMatcher,
  MetricIdentifier,
  ParenExpr,
  VectorSelector,
} from '@prometheus-io/lezer-promql';

import { handleAggregation } from './aggregation-utils';
import { handleBinary } from './binary-utils';
import { getString } from './common-utils';
import { handleFunction } from './function-utils';
import { getLabel } from './label-utils';
import { VisualizeContext } from './types';

export const ErrorId = 0;
export const handleExpression = (
  expr: string,
  node: SyntaxNode,
  context: VisualizeContext,
): void => {
  const visQuery = context.query;
  switch (node.type.id) {
    case MetricIdentifier: {
      // Expectation is that there is only one of those per query.
      visQuery.metric = getString(expr, node);
      break;
    }

    case LabelMatcher: {
      // Same as MetricIdentifier should be just one per query.
      visQuery.labels.push(getLabel(expr, node));
      const err = node.getChild(ErrorId);
      if (err) {
        context.errors.push(makeError(expr, err));
      }
      break;
    }

    case FunctionCall: {
      handleFunction(expr, node, context);
      break;
    }

    case AggregateExpr: {
      handleAggregation(expr, node, context);
      break;
    }

    case BinaryExpr: {
      handleBinary(expr, node, context);
      break;
    }

    case ErrorId: {
      if (isIntervalVariableError(node)) {
        break;
      }
      context.errors.push(makeError(expr, node));
      break;
    }

    default: {
      if (node.type.id === ParenExpr) {
        // We don't support parenthesis in the query to group expressions. We just report error but go on with the
        // parsing.
        context.errors.push(makeError(expr, node));
      }
      // Any other nodes we just ignore and go to its children. This should be fine as there are lots of wrapper
      // nodes that can be skipped.
      // TODO: there are probably cases where we will just skip nodes we don't support and we should be able to
      //  detect those and report back.
      let child = node.firstChild;
      while (child) {
        handleExpression(expr, child, context);
        child = child.nextSibling;
      }
    }
  }
};

const makeError = (expr: string, node: SyntaxNode) => {
  return {
    text: getString(expr, node),
    from: node.from,
    to: node.to,
    parentType: node.parent?.name,
  };
};

const isIntervalVariableError = (node: SyntaxNode): boolean => {
  return (
    node.prevSibling?.type.id === Expr &&
    node.prevSibling?.firstChild?.type.id === VectorSelector
  );
};
