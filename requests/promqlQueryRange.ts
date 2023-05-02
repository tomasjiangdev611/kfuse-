import dayjs from 'dayjs';
import { buildPromqlQuery, onPromiseError } from 'utils';
import fetchJson from './fetchJson';

const buildLabel = (dataset, metricName) => {
  const { metric } = dataset;
  const keys = Object.keys(metric);

  if (!keys.length) {
    return metricName;
  }

  const labelString = keys
    .filter((label) => label !== '__name__' && label !== 'labels')
    .map((label) => `${label}:${metric[label]}`)
    .join(' ');
  return `${metricName}${labelString ? ` ${labelString}` : ''}`;
};

const formatDatasets = (metricName: string) => (datasets) => {
  return datasets.map((dataset) => ({
    data: dataset.values.map((arr) => ({
      ts: Math.floor(arr[0]),
      value: Number(arr[1]),
    })),
    label: buildLabel(dataset, metricName),
  }));
};

const promqlQueryRange = ({ metric, secondsFromNow }): Promise<any> => {
  const now = dayjs();
  const start = now.subtract(secondsFromNow, 'seconds').toISOString();
  const end = now.toISOString();
  const { promqlQuery, shouldUsePromqlQuery } = metric;
  const query = shouldUsePromqlQuery ? promqlQuery : buildPromqlQuery(metric);

  return fetchJson(
    `api/v1/query_range?query=${query}&start=${start}&end=${end}&step=${Math.round(
      secondsFromNow / 100,
    )}s`,
  )
    .then((result) => result.data?.result || [], onPromiseError)
    .then(formatDatasets(metric?.metricName || promqlQuery), onPromiseError);
};

export default promqlQueryRange;
