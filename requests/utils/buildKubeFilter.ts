import { eventsFacets } from 'constants/labels';
import { SelectedFacetValuesByName } from 'types';
import { eventQueryOperator, getIsDeselecting } from 'utils';

export const getOperatorInQuery = (query: string): string => {
  const result = Object.keys(eventQueryOperator).find((key) =>
    query.includes(key),
  );
  return result || '';
};

export const buildKubeFilter = (
  filterByFacets: unknown,
  searchTerms: string[],
  selectedFacetValuesByName: SelectedFacetValuesByName,
): string => {
  if (!selectedFacetValuesByName) {
    return '{}';
  } else {
    const names = Object.keys(selectedFacetValuesByName);

    let result = '{ and: [';

    if (names[0] == 'key') {
      if (Array.isArray(selectedFacetValuesByName.key)) {
        for (let i = 0; i < selectedFacetValuesByName.key.length; i++) {
          const facet: Facet = {
            type: 'TAG',
            key: selectedFacetValuesByName.key[i],
            value: selectedFacetValuesByName.value[i],
          };
          result += `{ eq: {facet: { type: TAG, key: "${facet.key}", value: "${facet.value}" }}}`;
        }
      } else {
        result += `{ eq: {facet: { type: TAG, key: "${selectedFacetValuesByName.key}", value: "${selectedFacetValuesByName.value}" }}}`;
      }
    } else {
      names.forEach((name) => {
        const selectedFacetValues = selectedFacetValuesByName[name];
        const isDeselecting = getIsDeselecting(selectedFacetValues);

        Object.keys(selectedFacetValues).forEach((key) => {
          result += '{';
          result += isDeselecting ? 'neq:' : 'eq:';
          result += '{ facet: ';
          result += `{ key:"${
            eventsFacets.includes(name) ? '@' : ''
          }${name}", value:"${key}" , type:TAG }}`;
          result += '}';
        });
      });
    }

    if (searchTerms.length) {
      searchTerms.forEach((term) => {
        result += `{ or: [{contains: {name: "@text", value: "${term}"}}, {contains: {name: "@title", value: "${term}"}}] }`;
      });
    }

    if (filterByFacets) {
      const values = Object.values(filterByFacets);
      const labelIndex = values.findIndex((value) => value === 'LABEL');
      const typeValue = labelIndex >= 0 ? 'LABEL' : 'TAG';
      Object.keys(filterByFacets).forEach((facet) => {
        const splitOperator = getOperatorInQuery(facet);
        if (splitOperator) {
          const [name, value] = facet.split(splitOperator);
          result += `{${eventQueryOperator[splitOperator]}: { facet:{key: "${
            eventsFacets.includes(name) ? '@' : ''
          }${name}", value: "${value}", type:${typeValue}}}}`;
        }
      });
    }

    result += '] }';

    return result;
  }
};

export default buildKubeFilter;
