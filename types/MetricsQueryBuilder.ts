import { AutocompleteOption } from 'components';
import { Series } from 'uplot';

export type VectorTypes = 'instant' | 'range';

export type ExplorerQueryProps = {
  isValid?: boolean;
  isActive?: boolean;
  functions?: FunctionProps[];
  labels: string[];
  legendFormat?: string;
  metric: string;
  promql?: string;
  queryKey: string;
  series: string[];
  showInput?: boolean;
  steps?: number;
};

export type FunctionProps = {
  name: string;
  params?: FunctionParamsProps[];
  vectorType: VectorTypes;
};

export type FunctionParamsProps = {
  name: string;
  default: any;
  value: any;
  type: 'text' | 'select' | 'multi-select';
  options?: AutocompleteOption[];
};

export type FormulaProps = {
  expression: string;
  isValid?: boolean;
  isActive?: boolean;
};

export type FunctionNamesProps = {
  category: string;
  description: string;
  expression: string;
  name: string;
  shortName: string;
  vectorType: VectorTypes;
};

export type ChartProps = {
  chartId: string;
  formulas: FormulaProps[];
  isLoading: boolean;
  isTitleEditing: boolean;
  queries: ExplorerQueryProps[];
  title: string;
};

export type QueryDimensionProps = {
  label: string;
  operator: string;
  value: string;
};

export type MetricsQueryItemProps = {
  formulas?: FormulaProps[];
  queries: ExplorerQueryProps[];
  queryIndex: number;
  steps?: number[];
  type: 'query' | 'formula';
  returnType?: 'string' | 'array';
};

export type MetricsQueriesDataProps = {
  [key: string]: {
    isLoading: boolean;
    data: { data: number[][]; maxValue: number; series: Series[] };
  };
};
