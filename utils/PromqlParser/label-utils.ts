import { SyntaxNode } from '@lezer/common';
import { LabelName, MatchOp, StringLiteral } from '@prometheus-io/lezer-promql';

import { getString } from './common-utils';
import { VisualizeQueryLabel } from './types';

export const getLabel = (
  expr: string,
  node: SyntaxNode,
): VisualizeQueryLabel => {
  const label = getString(expr, node.getChild(LabelName));
  const op = getString(expr, node.getChild(MatchOp));
  const value = getString(expr, node.getChild(StringLiteral)).replace(/"/g, '');

  return { label, op, value };
};
