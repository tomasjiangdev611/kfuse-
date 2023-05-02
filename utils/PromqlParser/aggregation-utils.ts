import { SyntaxNode } from '@lezer/common';
import {
  AggregateModifier,
  AggregateOp,
  FunctionCallArgs,
  FunctionCallBody,
  GroupingLabels,
  Without,
} from '@prometheus-io/lezer-promql';

import { getString } from './common-utils';
import { updateFunctionArgs } from './function-utils';
import { VisualizeContext, VisualizeQueryOperation } from './types';

export const handleAggregation = (
  expr: string,
  node: SyntaxNode,
  context: VisualizeContext,
): void => {
  const visQuery = context.query;
  const nameNode = node.getChild(AggregateOp);
  let funcName = getString(expr, nameNode);

  const modifier = node.getChild(AggregateModifier);
  const labels = [];

  if (modifier) {
    const byModifier = modifier.getChild(`By`);
    if (byModifier && funcName) {
      funcName = `__${funcName}_by`;
    }

    const withoutModifier = modifier.getChild(Without);
    if (withoutModifier) {
      funcName = `__${funcName}_without`;
    }

    labels.push(...getAllByType(expr, modifier, GroupingLabels));
  }

  const body = node.getChild(FunctionCallBody);
  const callArgs = body!.getChild(FunctionCallArgs);

  const op: VisualizeQueryOperation = { id: funcName, params: [] };
  visQuery.operations.unshift(op);
  updateFunctionArgs(expr, callArgs, context, op);
  // We add labels after params in the visual query editor.
  op.params.push(...labels);
};

export function getAllByType(
  expr: string,
  cur: SyntaxNode,
  type: number | string,
): string[] {
  if (cur.type.id === type || cur.name === type) {
    return [getString(expr, cur)];
  }
  const values: string[] = [];
  let pos = 0;
  let child = cur.childAfter(pos);
  while (child) {
    values.push(...getAllByType(expr, child, type));
    pos = child.to;
    child = cur.childAfter(pos);
  }
  return values;
}
