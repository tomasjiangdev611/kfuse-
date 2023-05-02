const getIsDeselecting = (selectedFacetValues: {
  [key: string]: number;
}) => {
  const selectedFacetValueKeys = Object.keys(selectedFacetValues);
  return (
    !selectedFacetValueKeys.length ||
    (selectedFacetValueKeys.length &&
      selectedFacetValues[selectedFacetValueKeys[0]] === 0)
  );
};

export default getIsDeselecting;
