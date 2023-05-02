import delimiter from 'constants/delimiter';
import { parseFilterByFacetQuery } from './autocomplete';

export const checkSourceExist = (
  selectedFacetValues: {
    [key: string]: number;
  },
  filterByFacets: string[],
): boolean => {
  let isSourceExist = false;
  Object.keys(selectedFacetValues).forEach((facetValue) => {
    if (facetValue.includes('source')) {
      const [_, facet] = facetValue.split(delimiter);
      if (facet === 'source') {
        isSourceExist = true;
        return true;
      }
    }
  });

  filterByFacets.forEach((facetValue: string) => {
    if (facetValue.includes('source')) {
      const parsedFilter = parseFilterByFacetQuery(facetValue, [
        { label: 'Core:source', value: 'Core:source' },
      ]);
      if (parsedFilter?.facetName === 'Core:source') {
        isSourceExist = true;
        return true;
      }
    }
  });

  return isSourceExist;
};
