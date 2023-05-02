const formatValueCounts = (valueCounts) =>
  valueCounts.map((valueCount) => ({
    count: valueCount.count,
    facetValue: valueCount.value,
  }));

  export default formatValueCounts;
