import { SyntaxNode, TreeCursor } from '@lezer/common';
import { VisualizeQuery } from './types';

const varTypeFunc = [
  (v: string, f?: string) => `\$${v}`,
  (v: string, f?: string) => `[[${v}${f ? `:${f}` : ''}]]`,
  (v: string, f?: string) => `\$\{${v}${f ? `:${f}` : ''}\}`,
];

/**
 * Get back the text with variables in their original format.
 * @param expr
 */
export const returnVariables = (expr: string): string => {
  return expr.replace(
    /__V_(\d)__(.+?)__V__(?:__F__(\w+)__F__)?/g,
    (match, type, v, f) => {
      return varTypeFunc[parseInt(type, 10)](v, f);
    },
  );
};

export const getString = (
  expr: string,
  node: SyntaxNode | TreeCursor | null | undefined,
): string => {
  if (!node) {
    return '';
  }
  return returnVariables(expr.substring(node.from, node.to));
};

export const isEmptyQuery = (query: VisualizeQuery) => {
  if (
    query.labels.length === 0 &&
    query.operations.length === 0 &&
    !query.metric
  ) {
    return true;
  }
  return false;
};
