const formatFacetNames = (facetNames) =>
  facetNames.map((facetName) => ({
    ...facetName,
    component: facetName.source,
  }));

export default formatFacetNames;
