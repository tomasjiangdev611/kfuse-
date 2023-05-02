import { eventsFacets } from 'constants';
import { SelectedFacetValuesByName } from 'types';
import {
  getIsDeselecting,
  getEventOperatorInQuery,
  eventQueryOperator,
} from 'utils';

const getFilterByFacetsBitmap = (filterByFacets: {
  [key: string]: boolean;
}) => {
  const bitmap: { [key: string]: { op: string; val: string }[] } = {};
  Object.keys(filterByFacets).forEach((facet) => {
    const splitOperator = getEventOperatorInQuery(facet);
    if (splitOperator) {
      const [name, value] = facet.split(splitOperator);
      if (!bitmap[name]) {
        bitmap[name] = [];
      }
      bitmap[name].push({ op: splitOperator, val: value });
    }
  });
  return bitmap;
};

export const buildEventsFilter = (
  filterByFacets: { [key: string]: boolean },
  searchTerms: string[],
  selectedFacetValuesByName: SelectedFacetValuesByName,
): string => {
  let result = '{ and: [';

  const names = Object.keys(selectedFacetValuesByName);
  names.forEach((name) => {
    const selectedFacetValues = selectedFacetValuesByName[name];
    const isDeselecting = getIsDeselecting(selectedFacetValues);
    const operator = isDeselecting ? 'neq' : 'eq';
    const prefix = eventsFacets.includes(name) ? '@' : '';

    const values = Object.keys(selectedFacetValues);
    if (values.length === 1) {
      result += `{${operator}: {name: "${prefix}${name}", value: "${values[0]}"}}`;
    }

    if (values.length > 1) {
      const condition = isDeselecting ? 'and' : 'or';
      result += `{ ${condition}: [`;
      values.forEach((value) => {
        result += `{${operator}: {name: "${prefix}${name}", value: "${value}"} }`;
      });
      result += '] }';
    }
  });

  if (searchTerms.length) {
    searchTerms.forEach((term) => {
      result += `{ or: [{contains: {name: "@text", value: "${term}"}}, {contains: {name: "@title", value: "${term}"}}] }`;
    });
  }

  if (filterByFacets) {
    const bitmap = getFilterByFacetsBitmap(filterByFacets);
    const names = Object.keys(bitmap);
    names.forEach((name) => {
      const facets = bitmap[name];
      const prefix = eventsFacets.includes(name) ? '@' : '';

      if (facets.length === 1) {
        const { op, val } = facets[0];
        result += `{${eventQueryOperator[op]}: {name: "${prefix}${name}", value: "${val}"}}`;
      } else {
        result += '{ or: [';
        facets.forEach(({ op, val }) => {
          const opStr = eventQueryOperator[op];
          result += `{${opStr}: {name: "${prefix}${name}", value: "${val}"}}`;
        });
        result += '] }';
      }
    });
  }

  result += '] }';

  return result;
};

export default buildEventsFilter;
