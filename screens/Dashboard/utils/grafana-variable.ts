import dayjs from 'dayjs';
import { DateSelection } from 'types';

/**
 * Replace dashboard template variables in promql
 * @param promql string
 * @param templating DashboardTemplateProps[]
 */
export const promqlVariableReplacer = (
  promql: string,
  variable: string,
  value: string,
): string => {
  promql = promql.replaceAll(`$${variable}`, value);
  promql = promql.replaceAll(`$\{${variable}}`, value);
  return promql;
};

/**
 * Function to get the value of a variable {$__to}
 * @param date DateSelection
 * @param variable string
 * @returns string
 * Variables are $__from, $__to
 * $__from is the start time of the date range
 * $__to is the end time of the date range
 * Avoid using momentjs as it is a heavy library
 *
 * Example: $__from = unix timestamp in miliseconds
 *         $__to = unix timestamp in miliseconds
 *
 * Example: ${__from:date} = 2021-01-01 00:00:00
 *         ${__to:date} = 2021-01-01 00:00:00
 *
 * Example: ${__from:date:iso} = 2021-01-01T00:00:00Z
 *        ${__to:date:iso} = 2021-01-01T00:00:00Z
 *
 * Example: ${__from:date:second} = unix timestamp in seconds
 *       ${__to:date:second} = unix timestamp in seconds
 *
 * Example: ${__from:date:YYYY-MM} = 2021-01
 *       ${__to:date:YYYY-MM} = 2021-01
 *
 * Example: ${__from:date:YYYY-MM-DD} = 2021-01-01
 *      ${__to:date:YYYY-MM-DD} = 2021-01-01
 *
 * Example: ${__from:date:M} = 1
 *      ${__to:date:M} = 1
 */

export const fromAndToVariableValue = (
  date: DateSelection,
  variable: string, // ${__to}, ${__from} {__to:date}, {__from:date}
): number | string => {
  const { startTimeUnix, endTimeUnix } = date;
  const from = startTimeUnix * 1000;
  const to = endTimeUnix * 1000;

  variable = variable.replace('}', '');
  const parts = variable.split(':');

  if (parts.length < 2 || (parts[0] !== '${__from' && parts[0] !== '${__to')) {
    return '';
  }

  const timestamp = parts[0] === '${__from' ? from : to;

  if (parts.length === 1) {
    return timestamp;
  }

  const dateObj = dayjs(timestamp);

  switch (parts[1]) {
    case 'date':
      const dateFormat =
        parts.length > 2 ? parts.slice(2).join(':') : 'YYYY-MM-DD HH:mm:ss';
      return dateObj.format(dateFormat);

    case 'second':
      return Math.floor(timestamp / 1000);

    default:
      return '';
  }
};

/**
 * Function to get the value of a variable {$__from} or {$__to}
 * @param promql string
 * @returns string
 *
 * Find ${__from or ${__to and return till end of the }
 */
export const parseFromAndToVariable = (
  promql: string,
): {
  fromVariable: string;
  toVariable: string;
} => {
  const fromVariable = promql.match(/\$\{__from[^}]*\}/g);
  const toVariable = promql.match(/\$\{__to[^}]*\}/g);

  return {
    fromVariable: fromVariable ? fromVariable[0] : '',
    toVariable: toVariable ? toVariable[0] : '',
  };
};

/**
 *
 */
export const replaceFromAndToVariable = (
  promql: string,
  date: DateSelection,
): string => {
  const { fromVariable, toVariable } = parseFromAndToVariable(promql);

  if (fromVariable) {
    promql = promql.replaceAll(
      fromVariable,
      fromAndToVariableValue(date, fromVariable),
    );
  }

  if (toVariable) {
    promql = promql.replaceAll(
      toVariable,
      fromAndToVariableValue(date, toVariable),
    );
  }

  return promql;
};
