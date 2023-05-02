import { FunctionProps, FunctionParamsProps } from 'types/MetricsQueryBuilder';

import { DURATION_OPTIONS } from './functions-params-utils';

export const ROLLUP_FUNCTIONS = [
  'avg_over_time',
  'min_over_time',
  'max_over_time',
  'sum_over_time',
  'count_over_time',
  'quantile_over_time',
  'stddev_over_time',
  'stdvar_over_time',
  'last_over_time',
];

export const getRollupParam = (name: string): FunctionParamsProps[] => {
  const params: FunctionParamsProps[] = [
    {
      name: 'duration',
      default: '10m',
      options: DURATION_OPTIONS,
      type: 'select',
      value: '10m',
    },
  ];

  if (name === 'quantile_over_time') {
    params.push({
      name: 'quantile',
      default: 0.99,
      value: 0.99,
      type: 'text',
    });
  }

  return params;
};

export const getRollupPromQL = (
  func: FunctionProps,
  isRangeVector: boolean,
  query: string,
): string => {
  const { name, params } = func;
  if (name === 'quantile_over_time') {
    const [interval, quantile] = params;
    return `${name}(${quantile.value}, ${query} [${interval.value}${
      isRangeVector ? ':' : ''
    }])`;
  }

  const [interval] = params;
  return `${name}(${query} [${interval.value}${isRangeVector ? ':' : ''}])`;
};
