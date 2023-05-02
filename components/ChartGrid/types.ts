import { ReactNode } from 'react';
import {
  ChartGridItem,
  PrometheusMetric,
  PrometheusDatasetWithLabel,
} from 'types';

export type ChartOption = {
  label: string;
  value: any;
};

export type Chart = {
  chartType?: string;
  colorMap?: { [key: string]: string };
  getChartType?: (param: any) => string;
  getDatasetsFormatter: (
    param: any,
  ) => (datasets: PrometheusDatasetWithLabel[]) => ChartGridItem;
  getInstant: (param: any) => boolean;
  getXAxisTickFormatter?: (
    param: any,
  ) => (labels: number[]) => (s: number) => string;
  getYAxisTickFormatter: (param: any) => (s: number) => string;
  initialParam?: string;
  options?: ChartOption[];
  labels?: ((metric: PrometheusMetric) => string)[];
  render?: () => ReactNode;
  queries?: (param: any) => string[];
  step?: string;
  yAxisTickFormatter?: (s: number) => string;
};
