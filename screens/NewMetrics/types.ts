import { DateSelection, ExplorerQueryProps, FormulaProps } from 'types';

export type MetricsChartsModalProps = {
  explorerDate: DateSelection;
  explorerData: any;
  onClose: () => void;
  queryItem: MetricsChartsQueryItemProps;
};

export type MetricsChartsQueryItemProps = {
  formulas?: FormulaProps[];
  queries: ExplorerQueryProps[];
  queryIndex: number;
  steps?: number[];
  type: 'query' | 'formula';
};

export type CompareToPreviousProps = {
  isActive: boolean;
  label: string;
  value: string;
};

export type MetricsMultiDatePromqlProps = {
  promql: string;
  date: DateSelection;
  label?: string;
};
