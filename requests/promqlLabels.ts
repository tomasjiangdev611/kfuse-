import { onPromiseError } from 'utils';
import fetchJson from './fetchJson';
import promqlLabelValues from './promqlLabelValues';

const fetchDimensionValuesHandler =
  (metricName: string) => async (labels: string[]) => {
    const metricDimensionValuesArray = await Promise.all(
      labels.map((label) => promqlLabelValues(metricName, label)),
    );

    return metricDimensionValuesArray.reduce(
      (obj, metricDimensionValues, i) => ({
        ...obj,
        [labels[i]]: metricDimensionValues.filter(
          (metricDimensionValue) => metricDimensionValue !== 'null',
        ),
      }),
      {},
    );
  };

const promqlLabels = (metricName: string): Promise<any> =>
  fetchJson(`/api/v1/labels?match[]=${metricName}`)
    .then(
      (result) =>
        (result.data || []).filter(
          (label) => label !== '__name__' && label !== 'labels',
        ),
      onPromiseError,
    )
    .then(fetchDimensionValuesHandler(metricName), onPromiseError);

export default promqlLabels;
