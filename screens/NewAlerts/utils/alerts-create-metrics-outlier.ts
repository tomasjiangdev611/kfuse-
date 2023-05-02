import { AutocompleteOption } from 'components';
import { OutlierConditionProps } from '../types';

export const toleranceType: AutocompleteOption[] = [
  { label: '0.33', value: '0.33' },
  { label: '0.5', value: '0.5' },
  { label: '0.6', value: '0.6' },
  { label: '1.0', value: '1.0' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2.0' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3.0' },
  { label: '3.5', value: '3.5' },
  { label: '4.0', value: '4.0' },
  { label: '4.5', value: '4.5' },
  { label: '5.0', value: '5.0' },
];

export const parseOutlierPromql = (
  promql: string,
): {
  promql: string;
  algorithm: string;
  tolerance: string;
} => {
  const regex = /outliers\((.*),.*\)/;
  promql = promql.replace(regex, '$1');
  const split = promql.split(',');
  const [newPromql, algorithm, nor, tolerance, nol] = split;

  return {
    promql: newPromql,
    algorithm: algorithm.trim().replace(/'/g, ''),
    tolerance: tolerance.trim(),
  };
};

export const buildOutlierAlertPromql = (
  promql: string,
  outliersCondition: OutlierConditionProps,
  type: 'load' | 'create' = 'create',
): string => {
  if (!promql) return '';

  const { algorithm, tolerance } = outliersCondition;

  if (type === 'load') {
    return `outliers(${promql}, '${algorithm}', 1, ${tolerance})`;
  }
  return `outliers(${promql}, '${algorithm}', 1, ${tolerance}, 1)`;
};
