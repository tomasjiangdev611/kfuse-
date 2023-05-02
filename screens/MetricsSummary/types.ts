export type MetricSeriesProps = {
  data: { [key: string]: string[] };
  metricKeys: string[];
};

export type MertricsSummaryProps = {
  help: string;
  name: string;
  unit: string;
  type: string;
};

export type SearchFilterProps = {
  search: string;
  type: string[];
  origin: string[];
};
