import { ReactNode } from 'react';
import { DateSelection } from './DateSelection';
import { PrometheusMetric, PrometheusDatasetWithLabel } from './prometheus';

export type ChartJsData = { [key: string]: number };

export type ChartGridReferenceLine = {
  label: string;
  x: number;
};

type RenderTooltipTimestampArgs = {
  index: number;
  stepInMs: number;
  timestamp: number;
};

export type ChartGridItem = {
  data: ChartJsData[];
  keys: string[];
  renderTooltipTimestamp?: ({
    index,
    stepInMs,
    timestamp,
  }: RenderTooltipTimestampArgs) => ReactNode;
  referenceLines?: ChartGridReferenceLine[];
  timestamps: number[];
};

export type ChartGridItemRender = {
  data: ChartJsData[];
  keys: string[];
  timestamps: number[];
};

export type ChartOption = {
  label: string;
  value: string;
};

export type ChartGridItemType = {
  initialKey?: string;
  charts: Chart[];
};

type ChartQueryArgs = {
  chart: Chart;
  date: DateSelection;
  instant?: boolean;
  parsedPromql?: boolean;
  step?: string;
  width: number;
};

export type ChartQuery = ({
  date,
  instant,
  parsedPromql,
  step,
}: ChartQueryArgs) => Promise<ChartGridItem>;

export type Chart = {
  key: string;
  chartType?: string;
  colorMap?: { [key: string]: string };
  datasetsFormatter?: (datasets: PrometheusDatasetWithLabel[]) => ChartGridItem;
  disableExplore?: boolean;
  disableLogScale?: boolean;
  instant?: boolean;
  initialParam?: string;
  label: string;
  labels?: ((metric: PrometheusMetric) => string)[];
  legendTableColumns?: ChartLegendTableColumn[];
  marginLeft?: number;
  onSelection?: (arg0: number, arg1: number) => void;
  options?: ChartOption[];
  render?: () => ReactNode;
  showCompactLegend?: boolean;
  query: ChartQuery;
  step?: string;
  xAxisTickFormatter?: (labels: number[]) => (s: number) => string;
  yAxisTickFormatter?: (s: number) => string;
};

export enum ChartLegendTableColumn {
  key = 'key',
  avg = 'avg',
  min = 'min',
  max = 'max',
  sum = 'sum',
}
