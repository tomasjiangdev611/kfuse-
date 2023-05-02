import { delimiter } from 'constants';

const getSelectedFacetValuesByFacetKey = (selectedFacetValues) => {
  const result = {};
  Object.keys(selectedFacetValues).forEach((facetValueCompositeKey) => {
    const [component, facetName, facetValue] =
      facetValueCompositeKey.split(delimiter);
    const facetKey = `${component}${delimiter}${facetName}`;

    if (!result[facetKey]) {
      result[facetKey] = {};
    }

    result[facetKey][facetValue] = selectedFacetValues[facetValueCompositeKey];
  });

  return result;
};

export default getSelectedFacetValuesByFacetKey;
