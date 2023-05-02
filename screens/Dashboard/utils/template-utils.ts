import { AutocompleteOption } from 'components/Autocomplete';
import { DashboardTemplateProps, DashboardTemplateValueProps } from '../types';

import { promqlVariableReplacer } from './grafana-variable';
/**
 * parse template query
 * @param query string
 * start with
 * 1. label_names()
 * 2. label_values(label)
 * 3. label_values(metric, label)
 * 4. metrics(metric)
 * 5. query_result(query)
 */
const parseTemplateQuery = (query: string) => {
  if (!query) return null;

  const queryResult = query.match(/query_result\((.*)\)/);
  if (queryResult) {
    return {
      type: 'query_result',
      query: queryResult[1],
    };
  }
  const labelNames = query.match(/label_names\((.*)\)/);
  if (labelNames) {
    return {
      type: 'label_names',
      query: labelNames[1],
    };
  }
  const labelValues = query.match(/label_values\((.*),(.*)\)/);
  if (labelValues) {
    return {
      type: 'series',
      query: labelValues[1],
      label: labelValues[2].trim(),
    };
  }
  const metrics = query.match(/metrics\((.*)\)/);
  if (metrics) {
    return {
      type: 'metrics',
      query: metrics[1],
    };
  }

  const labelValues2 = query.match(/label_values\((.*)\)/);
  if (labelValues2) {
    return {
      type: 'label_values',
      query: '',
      label: labelValues2[1].trim(),
    };
  }

  return null;
};

/**
 * get template variables from query
 * @param query string
 * @returns
 * query string may contain $variable or ${variable}
 * retrun variable list
 * example: error{kube_namespace=~"${namespace}",kube_service=~"${service}"}
 * return ['namespace', 'service']
 * example: error{kube_namespace=~"$namespace",kube_service=~"$service"}
 * return ['namespace', 'service']
 */
const getTemplateVariablesFromQuery = (query: string) => {
  if (!query) return [];

  const variables = query.match(/\$\{?(\w+)\}?/g);
  if (variables) {
    return variables.map((variable) => variable.replace(/\$|\{|\}/g, ''));
  }
  return [];
};

/**
 * Transform template query with template variables
 */
export const transformTemplateQuery = (
  query: string,
  newTemplateValues: DashboardTemplateValueProps,
): {
  type: string;
  query: string;
  label?: string;
} => {
  const variables = getTemplateVariablesFromQuery(query);
  const templateQuery = parseTemplateQuery(query);

  if (!templateQuery) return { type: '', query };
  const { type } = templateQuery;

  if (variables.length > 0) {
    variables.forEach((variable) => {
      if (newTemplateValues[variable]) {
        const value = newTemplateValues[variable];
        const replaceValue =
          typeof value === 'string' ? value : value.join('|');

        if (type === 'series') {
          templateQuery.query = promqlVariableReplacer(
            templateQuery.query,
            variable,
            replaceValue,
          );
        }
      }
    });
  }

  return templateQuery;
};

export const getSeriesLabelValues = (
  series: Array<{ [key: string]: any }>,
  label: string,
): string[] => {
  const labelValues: { [key: string]: boolean } = {};
  series?.forEach((s) => {
    if (s[label] && !labelValues[s[label]]) {
      labelValues[s[label]] = true;
    }
  });

  return Object.keys(labelValues);
};

/**
 * Check variable is used in query
 */
export const checkVariableUsedInQuery = (
  variable: string,
  templating: DashboardTemplateProps[],
): Array<{
  index: number;
  template: DashboardTemplateProps;
}> => {
  const result: Array<{
    index: number;
    template: DashboardTemplateProps;
  }> = [];

  templating.forEach((template, index) => {
    const { query } = template;
    const variables = getTemplateVariablesFromQuery(query.query);
    if (variables.includes(variable)) {
      result.push({ index, template });
    }
  });

  return result;
};

export const firstNonEmptyValue = (arr: AutocompleteOption[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value) {
      return arr[i].value;
    }
  }
  return '';
};

/**
 * Get template dependencies
 * @param newTemplates
 * @returns
 */
export const getTemplateDependencies = (
  newTemplates: DashboardTemplateProps[],
): { [key: number]: number[] } => {
  const dependencies: { [key: number]: number[] } = {};
  newTemplates.forEach((template, index) => {
    const { name } = template;
    const usedTemplates = checkVariableUsedInQuery(name, newTemplates);
    const usedTemplatesIndexs = usedTemplates.map((t) => t.index);

    if (!dependencies[index]) {
      dependencies[index] = [];
    }

    usedTemplatesIndexs.forEach((usedTemplateIndex) => {
      if (dependencies[usedTemplateIndex]) {
        dependencies[usedTemplateIndex].push(index);
      } else {
        dependencies[usedTemplateIndex] = [index];
      }
    });
  });

  return dependencies;
};
