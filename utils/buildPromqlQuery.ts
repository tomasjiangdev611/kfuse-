const buildOperator = (aggregateType: string, aggregateOn: string[]) => {
  if (aggregateType && aggregateOn.length) {
    return `${aggregateType || ''} by (${aggregateOn.join(',')})`;
  }

  return aggregateType || '';
};

const buildQueryFilters = (dimensionFilters) => {
  if (dimensionFilters.length) {
    return `{${dimensionFilters
      .map(
        (dimensionFilter, i) =>
          `${dimensionFilter.dimensionName}="${encodeURIComponent(
            dimensionFilter.dimensionValue,
          )}"`,
      )
      .join(',')}}`;
  }

  return '';
};

const buildPromqlQuery = (metric: {
  metricName: string;
  aggregateType: string;
  aggregateOn: string[];
  dimensionFilters: any[];
}): string => {
  const { aggregateOn, aggregateType, dimensionFilters, metricName } = metric;

  const query = `${metricName}${buildQueryFilters(dimensionFilters)}`;

  if (aggregateType) {
    return `${buildOperator(aggregateType, aggregateOn)}(${query})`;
  }

  return query;
};

export default buildPromqlQuery;
