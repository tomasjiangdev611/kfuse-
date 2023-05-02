export type PrometheusMetric = { span_name: string } & {
  [key: string]: string;
};

export type PrometheusMetricLabel = (
  metric: PrometheusMetric,
) => string | string;

export type PrometheusDataset = {
  metric: PrometheusMetric;
  value?: [number, string | number];
  values: [number, string][];
};
export type PrometheusDatasetWithLabel = PrometheusDataset & {
  label?: (metric: PrometheusMetric) => string;
};
