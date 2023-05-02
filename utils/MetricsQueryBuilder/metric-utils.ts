import { AutocompleteOption, chartColors } from 'components';
import {
  ExplorerQueryProps,
  FormulaProps,
  MetricsQueryItemProps,
  MetricsQueriesDataProps,
} from 'types/MetricsQueryBuilder';
import uPlot, { Series } from 'uplot';

import { getMetricsExplorerDefaultQuery } from '..';
import { buildPromqlWithFunctions } from './query-utils';

/**
 * Transform for metric list
 * @returns
 * example: {name: {}, value: {}} => [name, value]
 */
export const transformMetricList = (
  grafanaMetadata: any,
): AutocompleteOption[] => {
  const metricsList = Object.keys(grafanaMetadata).map((metricName) => {
    return {
      label: metricName,
      value: metricName,
    };
  });
  return metricsList;
};

/**
 * Transform for series list
 * @returns
 * example: [{"name": "value", "age": 21}, { "name": "some", "age": 22}] => ["name:value", "age:21", "name:some", "age:22"]
 */
export const transformSeriesList = (
  grafanaSeries: any,
): {
  labelsListOptions: AutocompleteOption[];
  seriesListOptions: AutocompleteOption[];
  seriesValuesOptions: { [key: string]: AutocompleteOption[] };
} => {
  const labels: { [key: string]: { [key: string]: boolean } } = {};
  grafanaSeries.map((series: any) => {
    delete series.__name__;
    Object.keys(series).map((item) => {
      if (!labels[item]) {
        labels[item] = {};
      }
      labels[item][series[item]] = true;
    });
  });

  const labelList = Object.keys(labels);
  const seriesValuesOptions: { [key: string]: AutocompleteOption[] } = {};
  const labelsListOptions: AutocompleteOption[] = [];
  const seriesListOptions: AutocompleteOption[] = [];

  labelList.map((label) => {
    labelsListOptions.push({ label, value: label });
    seriesListOptions.push({ label, value: `${label}=""` });

    const seriesValues = Object.keys(labels[label]).map((value) => {
      return { label: value, value };
    });
    seriesValuesOptions[label] = seriesValues;
  });

  return { labelsListOptions, seriesListOptions, seriesValuesOptions };
};

/**
 * Check if query is large
 * @param query
 * @returns boolean
 */
export const isQueryLarge = (query: ExplorerQueryProps): boolean => {
  if (query.functions.length > 0) {
    return true;
  }
  const mergedLabelAndSeries = [...query.labels, ...query.series].join('');
  return mergedLabelAndSeries.length > 40;
};

/**
 * Retrun only valid queries
 * @param query
 * @returns
 */
export const validateQuery = (
  query: ExplorerQueryProps[],
): ExplorerQueryProps[] => {
  return query.filter((q) => q.metric);
};

/**
 * Get next available letter for a new query
 * @returns string
 * example 'A' -> 'B'
 * example 'B' -> 'C'
 * example 'Z' -> 'AA'
 */
export const getNextLetter = (lastLetter: string): string => {
  const lastLetterCode = lastLetter.charCodeAt(0);
  if (lastLetterCode === 90) {
    return 'AA';
  }
  return String.fromCharCode(lastLetterCode + 1);
};

/**
 * Validate arithmetic expression
 * @param formula string
 * @param queryVar string[]
 * @returns boolean
 * example: 'a*b', ['a', 'b'] => true
 * example: 'a*c', ['a', 'b'] => true
 * example: '(2a*b', ['a', 'b'] => false
 */
export const validateArithmeticFormulas = (
  formula: string,
  queryVar: string[],
): boolean => {
  const supportedOperators = ['+', '-', '*', '%', '/', '^'];

  // get all characters from a to z from formula
  const formulaVar = new RegExp('[a-z]', 'gi');
  const formulaVarArray = formula.match(formulaVar);
  const checkAllCharExist = formulaVarArray?.every((char) => {
    return queryVar.includes(char);
  });
  if (!checkAllCharExist) {
    return false;
  }

  // check if formula has unsupported operators
  const formulaOperator = new RegExp('[+\\-*/%^]', 'gi');
  const formulaOperatorArray = formula.match(formulaOperator);
  const checkAllOperatorExist = formulaOperatorArray?.every((operator) => {
    return supportedOperators.includes(operator);
  });
  if (!checkAllOperatorExist) {
    return false;
  }

  // check open and close brackets
  const openBrackets = formula.match(/\(/g);
  const closeBrackets = formula.match(/\)/g);
  if (openBrackets?.length !== closeBrackets?.length) {
    return false;
  }

  // replace all char in formula with random number
  const formulaWithRandomNumber = formula.replace(/[a-z]/gi, '1');
  try {
    // evaluate math expression withouth eval
    const formulaEval = new Function(`return ${formulaWithRandomNumber}`);
    const formulaEvalResult = formulaEval();
    if (isNaN(formulaEvalResult)) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

export const buildFormulaQuery = (
  promqlQueries: string[],
  queryKeys: string[],
  formulas: FormulaProps[],
): string[] => {
  const formulaQueries: string[] = [];
  const promqlBitmap: { [key: string]: string } = {};
  promqlQueries.forEach((query, index) => {
    promqlBitmap[queryKeys[index]] = query;
  });

  formulas.forEach((formula: FormulaProps) => {
    if (formula.isValid) {
      let expression = '';
      const formulaLength = formula.expression.length;
      for (let i = 0; i < formulaLength; i++) {
        const char = formula.expression.charAt(i);
        if (queryKeys.includes(char)) {
          expression += `( ${promqlBitmap[char]} )`;
        } else {
          expression += char;
        }
      }

      // replace + with %2B if exists
      expression = expression.replaceAll(/\+/g, '%2B');
      formulaQueries.push(expression);
    }
  });

  return formulaQueries;
};

export const getLabelValuesCount = (options: AutocompleteOption[]): any => {
  return options.reduce((acc, option) => {
    const [label, value] = option.value.split(':');
    if (acc[label]) {
      acc[label] += 1;
    } else {
      acc[label] = 1;
    }
    return acc;
  }, {});
};

export const getMetricsExplorerUrl = (
  metricName: string,
  tagValue?: string,
): string => {
  const defaultQuery = getMetricsExplorerDefaultQuery(metricName, 0);
  if (tagValue) {
    const [tag, value] = tagValue.split(':');
    const newSeries = [`${tag}="${value}"`];
    defaultQuery['series'] = newSeries;
  }
  const url = `/#/metrics?metricsQueries=${encodeURIComponent(
    JSON.stringify([defaultQuery]),
  )}`;

  return url;
};

export const decodePromqlToReadable = (promql: string): string => {
  if (!promql) return promql;

  let encodedPromql = decodeURI(promql);

  // replace all the %2B with +
  if (encodedPromql.includes('%2B')) {
    encodedPromql = encodedPromql.replaceAll(/%2B/g, '+');
  }

  // replace all the %2F with /
  if (encodedPromql.includes('%2F')) {
    encodedPromql = encodedPromql.replaceAll(/%2F/g, '/');
  }

  return encodedPromql;
};

export const getPromqlQueryByIndex = (
  queryItem: MetricsQueryItemProps,
): string => {
  const { formulas, queries, queryIndex, type, returnType } = queryItem;
  if (type === 'query') {
    const query = { ...queries[queryIndex] };
    if (!query.metric) {
      return '';
    }

    const promqlQuery = buildPromqlWithFunctions(query, returnType);
    if (promqlQuery) {
      return promqlQuery;
    }
  }

  if (type === 'formula') {
    const formula = formulas[queryIndex];
    const queriesForFormula: string[] = [];
    queries.forEach((query) => {
      const promqlQuery = buildPromqlWithFunctions(query);
      queriesForFormula.push(promqlQuery);
    });
    const queryKeys = queries.map((query) => query.queryKey);
    const promqlFormula = buildFormulaQuery(queriesForFormula, queryKeys, [
      formula,
    ]);

    if (promqlFormula[0]) {
      return promqlFormula[0];
    }
  }

  return '';
};

export const checkIfQueryHasAnomaly = (query: ExplorerQueryProps) => {
  if (!query || !query.functions) return false;
  return query.functions.some((func) => func.name === 'anomalies');
};

const getAnomalyChartBand = (
  key: string,
  idx: number,
  anomalyChartBands: number[],
) => {
  const keySplit = key.split('_');
  const lastKey = keySplit[keySplit.length - 1];

  if (lastKey === 'anomaly') {
    anomalyChartBands[0] = idx;
  }

  if (lastKey === 'upper') {
    anomalyChartBands[1] = idx;
  }

  if (lastKey === 'lower') {
    anomalyChartBands[2] = idx;
  }
};

export const combineQueriesData = (
  formulas: FormulaProps[],
  queries: ExplorerQueryProps[],
  queryData: MetricsQueriesDataProps,
) => {
  console.log('combineQueriesData', queryData);
  const chartKeys = Object.keys(queryData);
  let newData: Array<number[]> = [];
  let newMaxValue: number = null;
  const newSeries: Series[] = [];
  let isLoading = false;
  const anomalyChartBands = [0, 0, 0];

  chartKeys.forEach((key, queryIndex) => {
    if (queryData[key].isLoading) {
      isLoading = true;
    }

    const [type, idx] = key.split('_');
    const idxNum = Number(idx);
    if (idxNum < 0) return;
    if (type === 'query' && !queries[idxNum]) return;
    if (type === 'formula' && !formulas[idxNum]) return;

    let isActive = false;
    if (type === 'query') {
      isActive = queries[idxNum].isActive;
    } else {
      isActive = formulas[idxNum].isActive;
    }
    if (!queryData[key].data || !isActive) return;

    const { data, maxValue, series } = queryData[key].data;
    if (!data || !series || series.length === 0) return;

    if (newData.length === 0) {
      newData = [...newData, ...data];
    } else {
      data.forEach((value: number[], index: number) => {
        if (index !== 0) newData.push(value);
      });
    }

    if (key.includes('anomaly')) {
      getAnomalyChartBand(key, newData.length - 1, anomalyChartBands);
    }

    const isAnomaly = key.endsWith('anomaly');
    const isAnomalyUpperLower = key.endsWith('upper') || key.endsWith('lower');
    newMaxValue = maxValue > newMaxValue ? maxValue : newMaxValue;
    series.forEach((s: Series, idx: number) => {
      return newSeries.push({
        ...s,
        stroke: isAnomalyUpperLower
          ? ''
          : chartColors[(idx + queryIndex) % chartColors.length],
        width: isAnomaly ? 2.5 : s.width,
      });
    });
  });

  const anomalyBand = [];
  if (anomalyChartBands[0] !== 0) {
    anomalyBand.push({
      series: [anomalyChartBands[1], anomalyChartBands[0]],
      fill: 'rgba(255,0,0,0.2)',
    });
    anomalyBand.push({
      series: [anomalyChartBands[2], anomalyChartBands[0]],
      fill: 'rgba(255,0,0,0.2)',
      dir: 1,
    });
  }

  return {
    data: newData,
    isLoading,
    maxValue: newMaxValue,
    series: newSeries,
    bands: anomalyBand,
  };
};

const rrcfAnomalyChartStroke = (
  u: uPlot,
  seriesData: number[],
  rrcfData: number[],
) => {
  const can = document.createElement('canvas');
  const ctx = can.getContext('2d');
  const chartWidth = u.bbox.width * 2;
  const grd = ctx.createLinearGradient(0, 0, chartWidth, 0);

  for (let i = 0; i <= seriesData.length; i++) {
    const pct = i / seriesData.length;
    grd.addColorStop(pct || 0, rrcfData[i] ? 'red' : 'blue');
  }

  return grd;
};
