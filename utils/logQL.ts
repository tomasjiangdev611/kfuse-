import { DateSelection } from 'types/DateSelection';

/**
 * Transforms a logQL query into a Loki query.
 * 1. Replace $__interval with the stepMs
 * 2. escape double quotes only if they are not already escaped
 */
export const transformLogQL = (
  logQL: string,
  date: DateSelection,
  width: number,
): string => {
  // remove double quotes that are already escaped
  let logQLSanitized = logQL.replace(/\\"/g, '"');
  logQLSanitized = logQLSanitized.replace(/"/g, '\\"');

  if (logQLSanitized.includes('$__interval')) {
    const steps = msIntervalByResolution(date, width);
    logQLSanitized = logQLSanitized.replace(/\$__interval/g, `${steps}ms`);
  }

  return logQLSanitized;
};

export const msIntervalByResolution = (
  date: DateSelection,
  width: number,
): number => {
  const { startTimeUnix, endTimeUnix } = date;
  const interval_step = (endTimeUnix - startTimeUnix) / width;
  const interval_rounded = Math.round(interval_step * 100) / 100;
  return interval_rounded * 1000;
};

/**
 * Returns the value of the $__range variable in milliseconds
 * @param date
 * @returns
 * @link https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__range
 */
export const secondRangeVariableValue = (date: DateSelection): string => {
  const { startTimeUnix, endTimeUnix } = date;
  const range = endTimeUnix - startTimeUnix;
  return `${Math.floor(range)}s`;
};

/**
 * Returns the value of the $__interval variable in milliseconds
 * @param date
 * @param width
 * @returns
 * @link https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__interval
 */
export const msIntervalVariableValue = (
  date: DateSelection,
  width: number,
): string => {
  const steps = msIntervalByResolution(date, width);
  return `${steps}ms`;
};

/**
 * Returns the value of the $__rate_interval variable in milliseconds
 * @param date
 * @param width
 * @returns
 * @link https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__rate_interval
 */
export const secondRateIntervalVariableValue = (
  date: DateSelection,
  width: number,
): string => {
  const scrape_interval = 15 * 1000;
  const interval = msIntervalByResolution(date, width);

  // max($__interval + Scrape interval, 4 * Scrape interval)
  const rate_interval = Math.max(
    interval + scrape_interval,
    4 * scrape_interval,
  );

  return `${Math.floor(rate_interval / 1000)}s`;
};
