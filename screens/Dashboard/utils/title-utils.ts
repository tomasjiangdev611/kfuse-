import { promqlVariableReplacer } from './grafana-variable';
import { DashboardTemplateValueProps } from '../types';

/**
 * @param {string} title
 */
export const transformTitle = (
  title: string,
  templateValues: DashboardTemplateValueProps,
): string => {
  const templateKeys = Object.keys(templateValues);
  templateKeys.forEach((name) => {
    const value = templateValues[name];
    const replaceValue = typeof value === 'string' ? value : value.join('|');
    title = promqlVariableReplacer(title, name, replaceValue);
  });

  return title;
};
