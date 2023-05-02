import { SyntaxNode } from '@lezer/common';

import { getString } from './common-utils';
import { validateArithmeticFormulas } from '../MetricsQueryBuilder';

export const traverseAndBuildFormula = (
  node: SyntaxNode,
  promql: string,
): string => {
  const replacedBitmap: [number, number][] = [];
  const formulasKeyBitmap: { [key: string]: string } = {};
  let formula = promql;

  traverseAndKeepBinaryExpr(node, promql, replacedBitmap, formulasKeyBitmap);

  if (replacedBitmap.length == 0) return '';
  const keys = Object.keys(formulasKeyBitmap);
  // sort by largest to smallest key value length
  const sortedKeys = keys.sort((a, b) => b.length - a.length);
  sortedKeys.forEach((key) => {
    const value = formulasKeyBitmap[key];
    formula = formula.replaceAll(key, value);
  });

  const queryKeys = Object.values(formulasKeyBitmap);
  if (!validateArithmeticFormulas(formula, queryKeys)) return '';
  return formula;
};

const traverseAndKeepBinaryExpr = (
  node: SyntaxNode,
  promql: string,
  replacedBitmap: [number, number][],
  formulasKeyBitmap: { [key: string]: string } = {},
) => {
  let child = node.firstChild;
  while (child) {
    traverseAndKeepBinaryExpr(child, promql, replacedBitmap, formulasKeyBitmap);
    child = child.nextSibling;
  }

  if (node.type.name === 'BinaryExpr') {
    const left = node.firstChild!;
    const right = node.lastChild!;

    const leftStr = getString(promql, left);
    const rightStr = getString(promql, right);

    const leftReplaced = checkIfBinaryReplaced(replacedBitmap, left);
    const rightReplaced = checkIfBinaryReplaced(replacedBitmap, right);

    if (!leftReplaced && leftStr) {
      replacedBitmap.push([left.from, left.to]);
      checkAndAssignNextKey(formulasKeyBitmap, leftStr);
    }

    if (!rightReplaced && rightStr) {
      replacedBitmap.push([right.from, right.to]);
      checkAndAssignNextKey(formulasKeyBitmap, rightStr);
    }
  }

  return promql;
};

const checkIfBinaryReplaced = (
  replacedBitmap: [number, number][],
  node: SyntaxNode,
) => {
  for (let i = 0; i < replacedBitmap.length; i++) {
    const [from, to] = replacedBitmap[i];
    if (node.from <= from && node.to >= to) {
      return true;
    }
  }
  return false;
};

const checkAndAssignNextKey = (
  formulasKeyBitmap: { [key: string]: string },
  replaceStr: string,
) => {
  // if replaceStr is a number, we don't need to replace it
  if (!isNaN(Number(replaceStr))) {
    return replaceStr;
  }

  if (formulasKeyBitmap[replaceStr]) {
    return formulasKeyBitmap[replaceStr];
  }

  const nextKey = Object.keys(formulasKeyBitmap).length;
  const nextKeyStr = String.fromCharCode(97 + nextKey);
  formulasKeyBitmap[replaceStr] = nextKeyStr;
  return nextKeyStr;
};
