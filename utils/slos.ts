import { SLOProps } from 'types';

/**
 * Get status and error budget
 * @param dataset
 * @param target
 * @returns
 * Error budget is
 * 1. 100 - target
 * 2. error budget total = (numerator / 100) * error budget
 * 3. error budget percentage = error budget total / denominator
 */
export const getStatusAndErrorBudget = (
  dataset: Array<any>,
  target: string,
): SLOProps['statusErrorBudget'] => {
  if (!dataset || dataset.length !== 2 || !target) return null;

  const [badEventsPromql, goodEventsPromql] = dataset;

  const numeratorValue = badEventsPromql?.value?.[1];
  const denominatorValue = goodEventsPromql?.value?.[1];

  if (!numeratorValue || !denominatorValue) return null;

  const numeratorValueFloat = parseFloat(numeratorValue);
  const denominatorValueFloat = parseFloat(denominatorValue);
  const targetFloat = parseFloat(target);

  const status = 100 - (numeratorValueFloat / denominatorValueFloat) * 100;
  const errorBudget = ((status - targetFloat) / (100 - targetFloat)) * 100;

  return {
    status: `${status.toFixed(2)}%`,
    statusColor: status < targetFloat ? 'red' : 'green',
    errorBudget: `${errorBudget.toFixed(2)}%`,
    errorBudgetColor: errorBudget < 0 ? 'red' : 'green',
    errorCount: numeratorValueFloat,
  };
};

/**
 * Transform promql to slo promql
 * @param promql
 * @returns string
 * replace {{.window}} with 1d
 */
export const transformSLOPromql = (promql: string): string => {
  const sloPromql = promql.replace(/{{\.window}}/g, '1d');
  return sloPromql;
};
