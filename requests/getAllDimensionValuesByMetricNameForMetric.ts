import query from './query';
import getDimensionValuesForMetric from './getDimensionValuesForMetric';

const fetchDimensionValuesHandler =
  (metricName: string) => async (dimensionNames: string[]) => {
    const metricDimensionValuesArray = await Promise.all(
      dimensionNames.map((dimensionName) =>
        getDimensionValuesForMetric(metricName, dimensionName),
      ),
    );

    return metricDimensionValuesArray.reduce(
      (obj, metricDimensionValues, i) => ({
        ...obj,
        [dimensionNames[i]]: metricDimensionValues.filter(
          (metricDimensionValue) => metricDimensionValue !== 'null',
        ),
      }),
      {},
    );
  };

const getAllDimensionValuesByMetricNameForMetric = (
  metricName: string,
): Promise<any> =>
  query(`
    {
      getAllDimensionNamesForMetric(metricName: "${metricName}")
    }
  `)
    .then((data) => data?.getAllDimensionNamesForMetric)
    .then(fetchDimensionValuesHandler(metricName));

export default getAllDimensionValuesByMetricNameForMetric;
