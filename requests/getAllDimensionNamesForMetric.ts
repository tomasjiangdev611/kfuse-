import query from './query';

const getAllDimensionNamesForMetric = (metricName: string): Promise<string[]> =>
  query<string[], 'getAllDimensionNamesForMetric'>(`
    {
      getAllDimensionNamesForMetric(metricName: "${metricName}")
    }
  `).then((data) => data?.getAllDimensionNamesForMetric);

export default getAllDimensionNamesForMetric;
