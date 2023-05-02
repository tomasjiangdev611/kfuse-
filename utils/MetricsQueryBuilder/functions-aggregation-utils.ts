import { FunctionParamsProps } from 'types/MetricsQueryBuilder';

export const AGGREGATE_FUNCTIONS = [
  'avg_by',
  'min_by',
  'max_by',
  'sum_by',
  'count_by',
  'stddev_by',
  'stdvar_by',
  'quantile_by',
];

const AGGREGATE_OPTIONS = [
  { label: 'avg', value: 'avg' },
  { label: 'min', value: 'min' },
  { label: 'max', value: 'max' },
  { label: 'sum', value: 'sum' },
  { label: 'count', value: 'count' },
  { label: 'stddev', value: 'stddev' },
  { label: 'stdvar', value: 'stdvar' },
  { label: 'quantile', value: 'quantile' },
];

export const getAggregationParam = (name: string): FunctionParamsProps[] => {
  const aggName = name.split('_')[0];
  const params: FunctionParamsProps[] = [
    {
      name: 'aggregate',
      default: aggName,
      options: AGGREGATE_OPTIONS,
      value: aggName,
      type: 'select',
    },
    {
      name: 'labels',
      default: '',
      options: [],
      value: [],
      type: 'multi-select',
    },
  ];
  if (name === 'quantile_by') {
    params.push({
      name: 'quantile',
      default: 0.99,
      value: 0.99,
      type: 'text',
    });
  }

  return params;
};

export const getAggregationPromQL = (
  query: string,
  params: FunctionParamsProps[],
): string => {
  const [aggregate, labels, quantile] = params;
  let aggName = '';
  if (labels.value.length === 0) {
    aggName = aggregate.value;
  }

  if (labels.value.length > 0) {
    aggName = `${aggregate.value} by (${labels.value.join(', ')})`;
  }

  if (aggregate.value === 'quantile') {
    return `${aggName}(${quantile.value}, ${query})`;
  }
  return `${aggName}(${query})`;
};
