import {
  ExplorerQueryProps,
  QueryDimensionProps,
} from 'types/MetricsQueryBuilder';

import { buildFunctionQuery, OFFSET_FUNCTIONS } from './functions-utils';
import { parseMetricLabelQuery } from './label-builder-utils';

export const buildAggregationQuery = (
  aggregateType: string,
  aggregateOn: string[],
): string => {
  if (aggregateType && aggregateOn.length) {
    return `${aggregateType || ''} (${aggregateOn.join(',')})`;
  }

  return aggregateType.substring(0, aggregateType.length - 3) || '';
};

export const buildQueryFilters = (
  dimensionFilters: QueryDimensionProps[],
): string => {
  if (dimensionFilters.length) {
    return `{${dimensionFilters
      .map(
        ({ label, operator, value }, i) =>
          `${label}${operator}"${encodeURIComponent(value)}"`,
      )
      .join(',')}}`;
  }

  return '';
};

export const getQueryDimensions = (series: string[]): QueryDimensionProps[] => {
  const validLabels: QueryDimensionProps[] = [];
  series.map((se) => {
    const { label, operator, value } = parseMetricLabelQuery(se);

    let labelValue = value;
    if (Array.isArray(value)) {
      labelValue = value.join('|');
    }

    if (label && operator) {
      validLabels.push({ label, operator, value: labelValue });
    }
  });

  return validLabels;
};

export const buildQuery = (
  metricName: string,
  dimensionFilters: QueryDimensionProps[],
): string => {
  const query = `${metricName}${buildQueryFilters(dimensionFilters)}`;

  return query;
};

const getIsRangeVector = (func: string, idx: number): boolean => {
  if (idx === 0) {
    return false;
  }

  if (OFFSET_FUNCTIONS.includes(func)) {
    return false;
  }

  return true;
};

export const buildPromqlWithFunctions = (
  query: ExplorerQueryProps,
  returnType: 'string' | 'array' = 'string',
): string => {
  const { functions, metric } = query;
  let promqlQuery = buildQuery(metric, getQueryDimensions(query.series));

  if (functions.length > 0) {
    functions.forEach((func, idx) => {
      const isRangeVector = getIsRangeVector(func.name, idx);
      promqlQuery = buildFunctionQuery(promqlQuery, func, isRangeVector);
    });
  }

  if (returnType === 'array') {
    return promqlQuery;
  }

  if (typeof promqlQuery === 'string') {
    return promqlQuery;
  }

  return promqlQuery[0];
};

export const checkIfQueryIsRangeVector = (
  queries: ExplorerQueryProps[],
): boolean => {
  let isRangeVector = false;
  queries.forEach((query) => {
    if (query.functions.length > 0) {
      query.functions.forEach((func, idx) => {
        isRangeVector = getIsRangeVector(func.name, idx);
      });
    }
  });

  return isRangeVector;
};
