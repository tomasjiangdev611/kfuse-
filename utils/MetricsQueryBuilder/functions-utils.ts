import { FunctionProps, FunctionNamesProps, FunctionParamsProps } from 'types';

import {
  AGGREGATE_FUNCTIONS,
  getAggregationParam,
  getAggregationPromQL,
} from './functions-aggregation-utils';
import {
  ANOMALIES_FUNCTIONS,
  getAnomaliesParams,
  getAnomaliesPromQL,
} from './functions-anomalies';
import functionsNames from './functions-names';
import { DURATION_OPTIONS } from './functions-params-utils';
import {
  getRollupParam,
  getRollupPromQL,
  ROLLUP_FUNCTIONS,
} from './functions-rollup-utils';
import {
  getTrigonometricPromQL,
  TRIGONOMETRIC_FUNCTIONS,
} from './functions-trig-utils';

const EMPTY_PARAMS_METRICS = [
  'abs',
  'absent',
  'ceil',
  'deriv',
  'log2',
  'log10',
  'exp',
  'floor',
  'scalar',
  'sort',
  'sort_desc',
  'ln',
  'sgn',
  'sqrt',
  'timestamp',
];

const TIME_FUNCTIONS = [
  'day_of_month',
  'day_of_week',
  'day_of_year',
  'days_in_month',
  'hour',
  'minute',
  'month',
  'year',
];

export const OFFSET_FUNCTIONS = [
  'day_before',
  'hour_before',
  'week_before',
  'month_before',
];

export const DURATION_PARAM_FUNCTIONS = [
  ...ROLLUP_FUNCTIONS,
  'absent_over_time',
  'changes',
  'resets',
  'count_not_null',
  'increase',
  'rate_per_second',
  'rate_per_minute',
  'rate_per_hour',
  'monotonic_diff',
  'diff',
  'irate',
];

export const OUTLIER_OPTIONS = [{ label: 'DBSCAN', value: 'DBSCAN' }];

export const getFunctionNameByShortName = (
  shortName: string,
): FunctionNamesProps => {
  const functionName = functionsNames.find(
    (functionProps) => functionProps.shortName === shortName,
  );
  return functionName ? functionName : null;
};

export const getFunctionParams = (
  functionName: string,
): FunctionParamsProps[] => {
  if (AGGREGATE_FUNCTIONS.includes(functionName)) {
    return getAggregationParam(functionName);
  }

  if (ROLLUP_FUNCTIONS.includes(functionName)) {
    return getRollupParam(functionName);
  }

  if (ANOMALIES_FUNCTIONS.includes(functionName)) {
    return getAnomaliesParams(functionName);
  }

  if (TRIGONOMETRIC_FUNCTIONS.includes(functionName)) {
    return null;
  }

  switch (functionName) {
    case 'abs':
    case 'log2':
    case 'log10':
    case 'scalar':
    case 'exp':
    case 'floor':
    case 'count_nonzero':
    case 'absent':
    case 'day_of_month':
    case 'day_of_week':
    case 'days_in_month':
    case 'day_of_year':
    case 'hour':
    case 'minute':
    case 'month':
    case 'year':
    case 'sort':
    case 'sort_desc':
    case 'ln':
    case 'sgn':
    case 'sqrt':
    case 'timestamp':
    case 'ceil':
      return null;
    case 'absent_over_time':
      return [
        {
          name: 'duration',
          default: '1m',
          options: DURATION_OPTIONS,
          type: 'select',
          value: '1m',
        },
      ];
    case 'changes':
    case 'resets':
      return [
        {
          name: 'duration',
          default: '5m',
          options: DURATION_OPTIONS,
          type: 'select',
          value: '5m',
        },
      ];
    case 'histogram_quantile':
      return [
        {
          name: 'quantile',
          default: 0.99,
          value: 0.99,
          type: 'text',
        },
      ];
    case 'monotonic_diff':
    case 'increase':
    case 'diff':
    case 'irate':
    case 'rate_per_second':
    case 'rate_per_minute':
    case 'rate_per_hour':
    case 'count_not_null':
    case 'offset':
      return [
        {
          name: 'duration',
          default: '10m',
          options: DURATION_OPTIONS,
          type: 'select',
          value: '10m',
        },
      ];
    case 'clamp_max':
      return [{ name: 'max', default: 100, value: 100, type: 'text' }];
    case 'clamp_min':
      return [{ name: 'min', default: 0, value: 0, type: 'text' }];
    case 'cutoff_max':
      return [{ name: 'max', default: 100, value: 100, type: 'text' }];
    case 'cutoff_min':
      return [{ name: 'min', default: 100, value: 100, type: 'text' }];
    case 'clamp':
      return [
        { name: 'min', default: 0, value: 0, type: 'text' },
        { name: 'max', default: 100, value: 100, type: 'text' },
      ];
    case 'topk':
      return [{ name: 'k', default: 10, value: 10, type: 'text' }];
    case 'round':
      return [{ name: 'nearest', default: 1, value: 1, type: 'text' }];
    case 'predict_linear':
      return [
        {
          name: 'interval',
          default: '5m',
          options: DURATION_OPTIONS,
          value: '5m',
          type: 'select',
        },
        { name: 'deviations', default: 1, value: 1, type: 'text' },
      ];
    case 'outliers':
      return [
        {
          name: 'outlier',
          default: 'DBSCAN',
          options: OUTLIER_OPTIONS,
          value: 'DBSCAN',
          type: 'select',
        },
        { name: 'tolerance', default: 0.8, value: 0.8, type: 'text' },
      ];
    case 'holt_winters':
      return [
        {
          name: 'duration',
          default: '10m',
          options: DURATION_OPTIONS,
          type: 'select',
          value: '10m',
        },
        { name: 'sf', default: 0.1, value: 0.1, type: 'text' },
        { name: 'tf', default: 0.9, value: 0.9, type: 'text' },
      ];
  }
};

export const buildFunctionQuery = (
  query: string,
  func: FunctionProps,
  isRangeVector: boolean,
): string => {
  const { name, params } = func;
  if (EMPTY_PARAMS_METRICS.includes(name)) {
    return `${name}(${query})`;
  }

  if (ROLLUP_FUNCTIONS.includes(name)) {
    return getRollupPromQL(func, isRangeVector, query);
  }

  if (AGGREGATE_FUNCTIONS.includes(name)) {
    return getAggregationPromQL(query, params);
  }

  if (TIME_FUNCTIONS.includes(name)) {
    return `${name}(${query})`;
  }

  if (TRIGONOMETRIC_FUNCTIONS.includes(name)) {
    return getTrigonometricPromQL(name, query);
  }

  if (ANOMALIES_FUNCTIONS.includes(name)) {
    return getAnomaliesPromQL(func, isRangeVector, query);
  }

  if (name === 'histogram_quantile') {
    const [quantile] = params;
    return `${name}(${quantile.value}, ${query} )`;
  }

  if (name === 'offset') {
    const [duration] = params;
    return `${query} offset ${duration.value}`;
  }
  if (name === 'day_before') {
    return `${query} offset 1d`;
  }
  if (name === 'hour_before') {
    return `${query} offset 1h`;
  }
  if (name === 'month_before') {
    return `${query} offset 4w`;
  }
  if (name === 'week_before') {
    return `${query} offset 1w`;
  }
  if (name === 'count_nonzero') {
    return `(count(${query}) != 0)`;
  }
  if (name === 'absent_over_time') {
    const [duration] = params;
    return `absent_over_time(${query} [${duration.value}${
      isRangeVector ? ':' : ''
    }])`;
  }
  if (name === 'changes') {
    const [duration] = params;
    return `changes(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }
  if (name === 'resets') {
    const [duration] = params;
    return `resets(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }

  if (name === 'diff') {
    const [duration] = params;
    return `delta(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }
  if (name === 'monotonic_diff') {
    const [duration] = params;
    return `idelta(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }
  if (name === 'irate') {
    const [duration] = params;
    return `irate(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }
  if (name === 'increase') {
    const [duration] = params;
    return `increase(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }
  if (name === 'rate_per_second') {
    const [duration] = params;
    return `rate(${query} [${duration.value}${isRangeVector ? ':' : ''}])`;
  }
  if (name === 'rate_per_minute') {
    const [duration] = params;
    return `rate(${query} [${duration.value}${isRangeVector ? ':' : ''}]) * 60`;
  }
  if (name === 'rate_per_hour') {
    const [duration] = params;
    return `rate(${query} [${duration.value}${
      isRangeVector ? ':' : ''
    }]) * 3600`;
  }
  if (name === 'clamp_max') {
    const [max] = params;
    return `clamp_max(${query}, ${max.value})`;
  }
  if (name === 'clamp_min') {
    const [min] = params;
    return `clamp_min(${query}, ${min.value})`;
  }
  if (name === 'cutoff_max') {
    const [max] = params;
    return `${query} =< ${max.value}`;
  }
  if (name === 'cutoff_min') {
    const [min] = params;
    return `${query} >= ${min.value}`;
  }
  if (name === 'clamp') {
    const [min, max] = params;
    return `clamp(${query}, ${min.value || 0}, ${max.value || 100})`;
  }
  if (name === 'topk') {
    const [k] = params;
    return `topk(${k.value}, ${query})`;
  }
  if (name === 'round') {
    const [nearest] = params;
    return `round(${query}, ${nearest.value})`;
  }
  if (name === 'predict_linear') {
    const [interval, deviations] = params;
    return `predict_linear(${query} [${interval.value}${
      isRangeVector ? ':' : ''
    }], ${deviations.value})`;
  }

  if (name === 'count_not_null') {
    const [duration] = params;
    return `present_over_time(${query} [${duration.value}${
      isRangeVector ? ':' : ''
    }])`;
  }

  if (name === 'outliers') {
    const [outlier, tolerance] = params;
    return `outliers(${query}, '${outlier.value}', ${tolerance.value}, 0.6)`;
  }

  if (name === 'holt_winters') {
    const [duration, sf, tf] = params;
    return `holt_winters(${query} [${duration.value}${
      isRangeVector ? ':' : ''
    }], ${sf.value}, ${tf.value})`;
  }

  return `${name}(${query})`;
};
