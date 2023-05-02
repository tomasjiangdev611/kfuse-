import { SearchItemProps } from 'types';

const findFirstOperator = (
  query: string,
): {
  operator: string;
  operatorIndex: number;
} => {
  const operators = ['=~', '!~', '!=', '='];
  const operatorBits: { [key: string]: string } = {};

  operators.forEach((operator) => {
    for (let i = 0; i < query.length; i++) {
      if (query.substring(i, i + operator.length) === operator) {
        operatorBits[`${i}-${operator.length}`] = operator;
      }
    }
  });

  const operatorBitsKeys = Object.keys(operatorBits);
  if (operatorBitsKeys.length === 0) {
    return { operator: null, operatorIndex: -1 };
  }

  const smallestIndex = operatorBitsKeys.reduce((a, b) => {
    const [aIndex, aLength] = a.split('-');
    const [bIndex, bLength] = b.split('-');
    return Number(aIndex) < Number(bIndex) ? a : b;
  });

  const [operatorIndex] = smallestIndex.split('-');
  let operator = operatorBits[`${operatorIndex}-1`];
  if (operatorBits[`${operatorIndex}-2`]) {
    operator = operatorBits[`${operatorIndex}-2`];
  }
  return { operator, operatorIndex: Number(operatorIndex) };
};
/**
 * Parses a search query.
 * ex: core:foo="bar" -> { facetName: 'core:foo', operator: '=', value: 'bar' }
 * ex: @core:foo!="bar" -> { facetName: 'core:foo', operator: '!=', value: 'bar' }
 * operators are =, !=, =~, !~
 * Values will be always double quoted.
 * operators will be escaped with a backslash.
 * @return { facetName: 'foo', value: 'bar', operator: '='}
 */
export function parseSearchQuery(query: string): SearchItemProps {
  if (!query) return null;

  // if start with backslash, it's an escaped query
  if (query[0] === '\\') {
    return null;
  }

  const { operator, operatorIndex } = findFirstOperator(query);
  if (!operator) {
    return null;
  }
  const facetName = query.substring(0, operatorIndex);
  if (!facetName) return null;

  const splitFacetName = facetName.split(':');
  if (splitFacetName.length > 2 || splitFacetName.length === 0) {
    return null;
  }

  if (!splitFacetName[0] || !splitFacetName[1]) {
    return null;
  }

  const startQuoteIndex = operatorIndex + operator.length;
  const endQuoteIndex = query.length - 1;
  if (startQuoteIndex === endQuoteIndex) return null;

  if (query[startQuoteIndex] !== '"') return null;
  if (query[endQuoteIndex] !== '"') return null;

  const value = query.substring(
    operatorIndex + operator.length + 1,
    query.length - 1,
  );

  if (!value) return null;

  return { facetName, operator, value };
}
