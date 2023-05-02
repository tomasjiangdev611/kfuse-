import { SyntaxNode } from '@lezer/common';
import {
  BinaryExpr,
  BinModifiers,
  GroupingLabels,
  GroupingLabelList,
  NumberLiteral,
  On,
  OnOrIgnoring,
} from '@prometheus-io/lezer-promql';

import { getString } from './common-utils';
import { handleExpression } from './expression';
import { binaryScalarDefs } from './promql-operation';
import {
  VisualizeContext,
  VisualizeQueryBinaryMatcher,
  VisualizeQueryBinaryQuery,
  VisualizeQueryOperation,
  VisualizeQueryOperationParamValue,
} from './types';

export const handleBinary = (
  expr: string,
  node: SyntaxNode,
  context: VisualizeContext,
): void => {
  const visQuery = context.query;
  const left = node.firstChild!;
  const op = getString(expr, left.nextSibling);
  const binModifier = getBinaryModifier(expr, node.getChild(BinModifiers));

  const right = node.lastChild!;
  const opDef = binaryScalarOperatorToOperatorName[op];
  const leftNumber = left.getChild(NumberLiteral);
  const rightNumber = right.getChild(NumberLiteral);
  const rightBinary = right.getChild(BinaryExpr);

  if (leftNumber) {
    //
  } else {
    handleExpression(expr, left, context);
  }

  if (rightNumber) {
    visQuery.operations.push(
      makeBinOp(opDef, expr, right, !!binModifier?.isBool),
    );
  } else if (rightBinary) {
    // Due to the way binary ops are parsed we can get a binary operation on the right that starts with a number which
    // is a factor for a current binary operation. So we have to add it as an operation now.
    const leftMostChild = getLeftMostChild(right);
    if (leftMostChild?.type.id === NumberLiteral) {
      visQuery.operations.push(
        makeBinOp(opDef, expr, leftMostChild, !!binModifier?.isBool),
      );
    }

    handleExpression(expr, right, context);
  } else {
    visQuery.binaryQueries = visQuery.binaryQueries || [];
    const binQuery: VisualizeQueryBinaryQuery = {
      operator: op,
      query: { metric: '', labels: [], operations: [] },
    };

    if (binModifier?.isMatcher) {
      binQuery.vectorMatchesType = binModifier.matchType;
      binQuery.vectorMatches = binModifier.matches;
    }

    visQuery.binaryQueries.push(binQuery);
    handleExpression(expr, right, {
      query: binQuery.query,
      errors: context.errors,
    });
  }
};

const binaryScalarOperatorToOperatorName = binaryScalarDefs.reduce(
  (acc, def) => {
    acc[def.sign] = {
      id: def.id,
      comparison: def.comparison,
    };
    return acc;
  },
  {} as Record<string, { id: string; comparison?: boolean }>,
);

const getBinaryModifier = (
  expr: string,
  node: SyntaxNode | null,
): VisualizeQueryBinaryMatcher | undefined => {
  if (!node) {
    return undefined;
  }

  if (node.getChild('Bool')) {
    return { isBool: true, isMatcher: false };
  } else {
    const matcher = node.getChild(OnOrIgnoring);
    if (!matcher) {
      return undefined;
    }
    const labels = getString(
      expr,
      matcher.getChild(GroupingLabels)?.getChild(GroupingLabelList),
    );

    return {
      isMatcher: true,
      isBool: false,
      matches: labels,
      matchType: matcher.getChild(On) ? 'on' : 'ignoring',
    };
  }
};

const makeBinOp = (
  opDef: { id: string; comparison?: boolean },
  expr: string,
  numberNode: SyntaxNode,
  hasBool: boolean,
): VisualizeQueryOperation => {
  const params: VisualizeQueryOperationParamValue[] = [
    parseFloat(getString(expr, numberNode)),
  ];
  if (opDef.comparison) {
    params.push(hasBool);
  }

  return { id: opDef.id, params };
};

const getLeftMostChild = (cur: SyntaxNode): SyntaxNode => {
  return cur.firstChild ? getLeftMostChild(cur.firstChild) : cur;
};
