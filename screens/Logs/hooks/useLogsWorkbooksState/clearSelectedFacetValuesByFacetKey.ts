import { delimiter } from 'constants';

const clearSelectedFacetValuesByFacetKey = (
  facetKey: string,
  prevDeselectedFacetValues: { [key: string]: number },
) => {
  return Object.keys(prevDeselectedFacetValues)
    .filter(
      (facetValueCompositeKey) =>
        facetValueCompositeKey.split(delimiter).slice(0, 2).join(delimiter) !==
        facetKey,
    )
    .reduce(
      (obj, facetValueCompositeKey) => ({
        ...obj,
        [facetValueCompositeKey]:
          prevDeselectedFacetValues[facetValueCompositeKey],
      }),
      {},
    );
};

export default clearSelectedFacetValuesByFacetKey;
