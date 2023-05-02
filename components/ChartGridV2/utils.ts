import { ChartJsData, ChartGridItem, PrometheusDatasetWithLabel } from 'types';
import { getPrometheusValues, roundNumber } from 'utils';
import { Compare } from './types';

export const defaultFormatDatasets = (
  datasets: PrometheusDatasetWithLabel[],
): ChartGridItem => {
  const data: ChartJsData[] = [];
  const keysBitmap: { [key: string]: number } = {};
  const timestamps: number[] = [];

  datasets.forEach((dataset: PrometheusDatasetWithLabel) => {
    const { label, metric } = dataset;
    const { span_name } = metric;
    const key = label ? label(metric) : span_name;

    keysBitmap[key] = 1;
    const values = getPrometheusValues(dataset.values);
    values.forEach((valueItem, i) => {
      const [timestamp, value] = valueItem;
      timestamps[i] = timestamp;

      if (!data[i]) {
        data[i] = {};
      }

      const convertedValue = Number(value);
      data[i][key] = isNaN(convertedValue) ? 0 : convertedValue;
    });
  });

  return {
    data,
    keys: Object.keys(keysBitmap).sort(),
    timestamps,
  };
};

export const getAggregationsByKey = (key: string, data: ChartJsData[]) => {
  let min: number = null;
  let max: number = null;
  const values: number[] = [];

  data.forEach((datum) => {
    const value = datum[key];
    if (typeof value === 'number') {
      if (min === null || value < min) {
        min = value;
      }

      if (max === null || value > max) {
        max = value;
      }

      values.push(value);
    }
  });

  const sum = values.length ? values.reduce((a, b) => a + b, 0) : 0;

  return {
    avg: roundNumber(values.length ? sum / values.length : 0),
    min: roundNumber(min),
    max: roundNumber(max),
    sum: roundNumber(sum),
  };
};

const compareDelimiter = ':compare';

export const getCompareKey = (key: string) => `${key}${compareDelimiter}`;
export const getCompareLabel = (compare: Compare) => `1 ${compare} before`;
export const isCompareKey = (key: string) => key.indexOf(compareDelimiter) > -1;
export const removeCompareFromKey = (key: string) =>
  key.replace(compareDelimiter, '');
