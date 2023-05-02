import query from './query';

const getDimensionValuesForMetric = async (
  metricName: string,
  dimension: string,
): Promise<string[]> => {
  return query<string[], 'getDimensionValuesForMetric'>(`
    {
      getDimensionValuesForMetric(
        metricName: "${metricName}"
        dimension: "${dimension}"
      )
    }
`).then((data) => data?.getDimensionValuesForMetric);
};

export default getDimensionValuesForMetric;
