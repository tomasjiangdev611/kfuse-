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

const promqlFormulaRange = ({ widget }): Promise<any> => {
  const { formula, metrics, secondsFromNow } = widget;
  const now = dayjs();
  const start = now.subtract(secondsFromNow, 'seconds').toISOString();
  const end = now.toISOString();
  const formulaParts = formula.split('');
  const queryByVariableName = {};

  metrics.forEach((metric, i) => {
    const variableName = String.fromCharCode(65 + i);
    queryByVariableName[variableName] = `(${buildPromqlQuery(metric)})`;
  });

  [...formulaParts].forEach((formulaPart, i) => {
    if (queryByVariableName[formulaPart]) {
      formulaParts[i] = queryByVariableName[formulaPart];
    }
  });

  const query = formulaParts.join('');

  return fetchJson(
    `api/v1/query_range?query=${query}&start=${start}&end=${end}&step=${Math.round(
      secondsFromNow / 100,
    )}s`,
  )
    .then((result) => result.data?.result || [], onPromiseError)
    .then(formatDatasets(query), onPromiseError);
};

export default promqlFormulaRange;
