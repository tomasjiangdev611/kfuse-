import { AutocompleteOption } from 'components';
import {
  buildPromqlWithFunctions,
  decodePromqlToReadable,
  parsePromqlAndBuildQuery,
} from 'utils';

import { MetricChangeConditionProps } from '../types';

export const changeType: AutocompleteOption[] = [
  { label: 'Change', value: 'change' },
  { label: 'Change %', value: 'change_percent' },
];

export const timeType: AutocompleteOption[] = [
  { label: '5 minutes', value: 'now-5m' },
  { label: '10 minutes', value: 'now-10m' },
  { label: '15 minutes', value: 'now-15m' },
  { label: '30 minutes', value: 'now-30m' },
  { label: '1 hour', value: 'now-1h' },
  { label: '2 hours', value: 'now-2h' },
  { label: '4 hours', value: 'now-4h' },
  { label: '1 day', value: 'now-1d' },
  { label: '2 days', value: 'now-2d' },
  { label: '1 week', value: 'now-7d' },
  { label: '1 month', value: 'now-30d' },
];

export const parseChangePromql = (
  promql: string,
): { change: string; promql: string; time: string } => {
  let time = '1h';
  let change = 'change';

  // find offset and value next to it
  const offsetRegex = /offset\s(\d+[smhdwMy])/g;
  const offsetMatch = offsetRegex.exec(promql);
  if (offsetMatch) {
    time = `now-${offsetMatch[1]}`;
  }

  const parsed = parsePromqlAndBuildQuery([promql]);
  const { queries } = parsed;

  if (queries.length === 0) return { change, promql: '', time };

  if (queries.length > 2 && promql.includes(' / ')) {
    change = 'change_percent';
  }

  const newPromql = buildPromqlWithFunctions(queries[0]);
  return { change, promql: decodePromqlToReadable(newPromql), time };
};

export const buildChangeAlertPromql = (
  changeCondition: MetricChangeConditionProps,
  promql: string,
): string => {
  if (!promql) return '';

  const { change, time } = changeCondition;
  const timeDuration = time.split('-')[1];

  const parsed = parsePromqlAndBuildQuery([promql]);
  parsed.queries[0].functions.unshift({
    name: 'offset',
    params: [
      { default: '', name: 'duration', type: 'select', value: timeDuration },
    ],
    vectorType: 'instant',
  });

  const offsetQuery = buildPromqlWithFunctions(parsed.queries[0]);
  if (change === 'change_percent') {
    return `(${offsetQuery} - ${promql}) / ${offsetQuery}`;
  }

  return `${promql} - ${offsetQuery}`;
};
