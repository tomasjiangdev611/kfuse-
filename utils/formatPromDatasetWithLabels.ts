import {
  ChartJsData,
  ChartGridItem,
  PrometheusDataset,
  PrometheusMetricLabel,
} from 'types';
import getPrometheusValues from './getPrometheusValues';

export const formatPromDatasetWithLabels =
  (labels: PrometheusMetricLabel[]) =>
  (datasets: PrometheusDataset[]): ChartGridItem => {
    const data: ChartJsData[] = [];
    const keysBitmap: { [key: string]: number } = {};
    const timestamps: number[] = [];

    datasets.forEach((dataset: PrometheusDataset, i) => {
      const { metric } = dataset;
      const { span_name } = metric;
      const label = labels[i];
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

export default formatPromDatasetWithLabels;
