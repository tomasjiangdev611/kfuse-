import { SelectedFacetValuesByName } from 'types';
import getIsDeselecting from './getIsDeselecting';

export const filterListWithSelectedSidebar = (
  array: Array<any>,
  conditions: SelectedFacetValuesByName,
) => {
  const groupedConditions: {
    [key: string]: Array<{ facetValue: string; facet: string; type: string }>;
  } = {};

  Object.keys(conditions).forEach((source) => {
    const selectedFacetValues = conditions[source];
    const sourceLowerCase = source.toLowerCase();
    Object.keys(selectedFacetValues).forEach((facetValue) => {
      if (!groupedConditions[sourceLowerCase]) {
        groupedConditions[sourceLowerCase] = [];
      }
      groupedConditions[sourceLowerCase].push({
        facetValue: facetValue,
        facet: sourceLowerCase,
        type: getIsDeselecting(selectedFacetValues) ? 'neq' : 'eq',
      });
    });
  });

  return array.filter((item) => {
    return Object.entries(groupedConditions).every(([facet, conditions]) => {
      const cond = conditions.some((condition) => {
        const { type, facetValue } = condition;

        if (!item.hasOwnProperty(facet)) {
          return false;
        }

        const value = item[facet];
        const isArrayValue = Array.isArray(value);

        switch (type) {
          case 'eq':
            return isArrayValue
              ? value.includes(facetValue)
              : value === facetValue;

          case 'neq':
            return isArrayValue
              ? !value.includes(facetValue)
              : value !== facetValue;

          default:
            return true;
        }
      });
      return cond;
    });
  });

  return array;
};
