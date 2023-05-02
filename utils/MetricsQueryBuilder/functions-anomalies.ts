import { FunctionProps, FunctionParamsProps } from 'types/MetricsQueryBuilder';
import { getRollupToSecond } from 'utils/rollup';
import { DURATION_OPTIONS } from './functions-params-utils';
import { AnomalyConditionProps } from 'screens/NewAlerts/types';

export const ANOMALIES_FUNCTIONS = ['anomalies'];

const ANAMOLY_OPTIONS = [{ label: 'basic', value: 'basic' }];

const BOUND_OPTIONS = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
];

const PRE_DEFINED_THRESHOLD: {
  [key: string]: [number, number];
} = {
  '1': [0.68, 0.16],
  '2': [0.9775, 0.0225],
  '3': [0.9987, 0.0013],
};

export const getAnomaliesParams = (
  functionName: string,
): FunctionParamsProps[] => {
  return [
    {
      name: 'anomaly',
      default: 'basic',
      options: ANAMOLY_OPTIONS,
      value: 'basic',
      type: 'select',
    },
    {
      name: 'window',
      default: '10m',
      options: DURATION_OPTIONS,
      value: '5m',
      type: 'select',
    },
    {
      name: 'bounds',
      default: 1,
      options: BOUND_OPTIONS,
      value: 1,
      type: 'select',
    },
  ];
};

export const getAnomaliesPromQL = (
  func: FunctionProps,
  isRangeVector: boolean,
  query: string,
): string | string[] => {
  const { name, params } = func;
  const [anomaly, window, bounds] = params;
  const isSubquery = isRangeVector ? ':' : '';
  if (anomaly.value === 'agile') {
    // return `sarima(${query}[${window.value}${isSubquery}], 1,1,1,1,1,1,10,1,2)`;

    const rrcf = `rrcf_anomalies(${query}, 10, 256, 15, 1, 1, 1, 1)`;
    return [rrcf, query];
  }

  if (anomaly.value === 'robust') {
    const windowMinutes = getRollupToSecond(window.value) / 60;
    return `seasonal_decompose(${query} [${windowMinutes}m${isSubquery}], ${
      windowMinutes / 3
    }, 0, ${windowMinutes}, ${bounds.value})`;
  }

  const upper = `rolling_quantile(${query} [${window.value}${isSubquery}], 2, ${
    PRE_DEFINED_THRESHOLD[bounds.value][0]
  })`;
  const lower = `rolling_quantile(${query} [${window.value}${isSubquery}], 2, ${
    PRE_DEFINED_THRESHOLD[bounds.value][1]
  })`;

  return [upper, lower, query];
};

export const getBasicAnomaliesPromQL = (
  anomalyCondition: AnomalyConditionProps,
  query: string,
): string | string[] => {
  const upper = `rolling_quantile(${query} [${anomalyCondition.window}:], 2, ${
    PRE_DEFINED_THRESHOLD[anomalyCondition.bound][0]
  })`;
  const lower = `rolling_quantile(${query} [${anomalyCondition.window}:], 2, ${
    PRE_DEFINED_THRESHOLD[anomalyCondition.bound][1]
  })`;
  return [upper, lower];
};
