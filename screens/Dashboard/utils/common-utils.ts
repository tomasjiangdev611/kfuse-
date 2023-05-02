import dayjs from 'dayjs';
import { Layout } from 'react-grid-layout';
import { DateSelection, ExplorerQueryProps, FormulaProps } from 'types';
import {
  buildPromqlWithFunctions,
  buildFormulaQuery,
} from 'utils/MetricsQueryBuilder';
import {
  convertTimeStringToUnix,
  msIntervalVariableValue,
  secondRangeVariableValue,
  secondRateIntervalVariableValue,
  validateCodifiedDate,
} from 'utils';

import {
  promqlVariableReplacer,
  replaceFromAndToVariable,
} from './grafana-variable';
import {
  DashboardPanelProps,
  DashboardPanelTargetsProps,
  DashboardPanelType,
  DashboardReloadPanelsProps,
  DashboardTemplateValueProps,
} from '../types';

export const getPanelWidgetSize = (panelType: DashboardPanelType) => {
  switch (panelType) {
    case 'timeseries':
      return { w: 8, h: 6 };
    case 'table':
      return { w: 8, h: 6 };
    case 'piechart':
      return { w: 8, h: 6 };
    case 'text':
      return { w: 4, h: 2 };
    case 'stat':
      return { w: 6, h: 4 };
    case 'group':
      return { w: 8, h: 4 };
    default:
      return { w: 8, h: 6 };
  }
};

export const getDateFromRange = (from: string, to: string): DateSelection => {
  if (validateCodifiedDate(from) && validateCodifiedDate(to)) {
    const startTimeUnix = convertTimeStringToUnix(from);
    const endTimeUnix = convertTimeStringToUnix(to);

    return { startTimeUnix, endTimeUnix, startLabel: from, endLabel: to };
  }

  if (
    new Date(from).toString() !== 'Invalid Date' &&
    new Date(to).toString() !== 'Invalid Date'
  ) {
    return {
      startTimeUnix: dayjs(from).unix(),
      endTimeUnix: dayjs(to).unix(),
      startLabel: validateCodifiedDate(from) ? from : null,
      endLabel: validateCodifiedDate(to) ? to : null,
    };
  }

  return {
    startTimeUnix: convertTimeStringToUnix('now-5m'),
    endTimeUnix: convertTimeStringToUnix('now'),
    startLabel: 'now-5m',
    endLabel: 'now',
  };
};

export const isDragItemPlaceholder = (layouts: Layout[]): boolean => {
  return layouts.some((layout) => layout.i === 'placeholder');
};

export const getPromqlForQueryAndFormula = (
  queries: ExplorerQueryProps[],
  formulas: FormulaProps[],
): { promqlQueries: string[]; promqlFormulas: string[] } => {
  const promqlQueries: string[] = [];
  queries.forEach((query: ExplorerQueryProps) => {
    const promql = buildPromqlWithFunctions(query);
    promqlQueries.push(promql);
  });
  const queryKeys = queries.map((query: ExplorerQueryProps) => query.queryKey);
  const promqlFormulas = buildFormulaQuery(promqlQueries, queryKeys, formulas);

  return { promqlQueries, promqlFormulas };
};

/**
 * Replace condition with the instruction
 * @param promql
 * 1. replace $cluster, $cluster, $pod, $node, etc with *
 * 2. replace ${service}, ${namespace}, ${pod}, ${node}, etc with +
 */
export const transformPromql = ({
  date,
  promql,
  templateValues,
  width,
}: {
  date: DateSelection;
  promql: string;
  templateValues: DashboardTemplateValueProps;
  width: number;
}): string => {
  if (!promql) return promql;

  let santizedPromql = promql;
  // replace template variables
  if (Object.keys(templateValues).length > 0) {
    santizedPromql = replaceTemplateVariables(santizedPromql, templateValues);
  }

  // $__interval, $__rate_interval, $__range exists, replace with the value
  santizedPromql = replacePromqlVariables(date, santizedPromql, width);

  // replace + with %2B for prometheus if + exists
  if (santizedPromql.includes('+')) {
    santizedPromql = santizedPromql.replaceAll('+', '%2B');
  }

  return santizedPromql;
};

/**
 * Replace variables in promql
 * @param promql string
 * @returns string
 * Variables are $__interval, $__rate_interval, $__range
 */
const replacePromqlVariables = (
  date: DateSelection,
  promql: string,
  width: number,
): string => {
  // replace $__interval
  if (promql.includes('$__interval')) {
    promql = promql.replaceAll(
      '$__interval',
      msIntervalVariableValue(date, width),
    );
  }

  // replace $__rate_interval
  if (promql.includes('$__rate_interval')) {
    promql = promql.replaceAll(
      '$__rate_interval',
      secondRateIntervalVariableValue(date, width),
    );
  }

  // replace $__range
  if (promql.includes('$__range')) {
    promql = promql.replaceAll('$__range', secondRangeVariableValue(date));
  }

  if (promql.includes('${__from') || promql.includes('${__to')) {
    promql = replaceFromAndToVariable(promql, date);
  }

  return promql;
};

/**
 * Replace dashboard template variables in promql
 * @param promql string
 * @param templating DashboardTemplateProps[]
 */
export const replaceTemplateVariables = (
  promql: string,
  templateValues: DashboardTemplateValueProps,
): string => {
  const templateKeys = Object.keys(templateValues);
  templateKeys.forEach((name) => {
    const value = templateValues[name];
    const replaceValue = typeof value === 'string' ? value : value.join('|');
    promql = promqlVariableReplacer(promql, name, replaceValue);
  });

  return promql;
};

/**
 * Get reload panels all true
 */
export const getReloadPanels = (
  panels: DashboardPanelProps[],
  newReload: DashboardReloadPanelsProps,
): DashboardReloadPanelsProps => {
  panels.forEach((panel, idx) => {
    newReload[`${idx}`] = true;
    if (panel.panels) {
      getReloadPanelsNested(panel.panels, newReload, idx);
    }
  });

  return newReload;
};

export const getReloadPanelsNested = (
  panels: DashboardPanelProps[],
  newReload: DashboardReloadPanelsProps,
  nestedIndex: string,
): DashboardReloadPanelsProps => {
  panels.forEach((panel, idx) => {
    newReload[`${nestedIndex}-${idx}`] = true;
    if (panel.panels) {
      getReloadPanelsNested(panel.panels, newReload, `${nestedIndex}-${idx}`);
    }
  });

  return newReload;
};

/**
 * Get reload panels for templating
 */
export const getReloadPanelsForTemplating = (
  panels: DashboardPanelProps[],
  label: string,
  newReload: DashboardReloadPanelsProps,
  nestedIndex?: number,
): DashboardReloadPanelsProps => {
  panels.forEach((panel, idx) => {
    let panelKey = `${idx}`;
    if (nestedIndex) {
      panelKey = `${nestedIndex}-${idx}`;
    }

    if (panel.panels) {
      getReloadPanelsForTemplating(panel.panels, label, newReload, idx);
    } else if (panel.targets) {
      panel.targets.forEach((target) => {
        if (target.expr && target.expr.indexOf(label) !== -1) {
          newReload[`${panelKey}`] = true;
        }
      });
    }
  });

  return newReload;
};

/**
 * Replace logQL variables
 */
export const replaceLogQLVariables = (
  logQL: string,
  templateValues: DashboardTemplateValueProps,
): string => {
  const templateKeys = Object.keys(templateValues);
  templateKeys.forEach((name) => {
    const value = templateValues[name];
    const replaceValue = typeof value === 'string' ? value : value.join('|');
    logQL = promqlVariableReplacer(logQL, name, replaceValue);
  });

  return logQL;
};

/**
 * Transform formula expression to promQL query
 */
export const transformFormulaExpression = ({
  date,
  expression,
  targets,
  templateValues,
  width,
}: {
  date: DateSelection;
  expression: string;
  targets: DashboardPanelTargetsProps[];
  templateValues: DashboardTemplateValueProps;
  width: number;
}): string => {
  const allPromQL: { [key: string]: string } = {};

  targets.map((target) => {
    if (target.expr) {
      const promql = transformPromql({
        date,
        promql: target.expr,
        templateValues,
        width,
      });
      allPromQL[target.refId] = promql;
    }
  });

  // replace $E / $B with promQL
  let formula = expression;
  Object.keys(allPromQL).forEach((key) => {
    formula = formula.replaceAll(`$${key}`, allPromQL[key]);
  });

  return formula;
};
