import { chartColors } from 'components';
import { DateSelection } from 'types/DateSelection';
import { ExplorerQueryProps, FormulaProps } from 'types/MetricsQueryBuilder';
import { Series } from 'uplot';
import {
  buildFormulaQuery,
  buildPromqlWithFunctions,
  getFunctionParams,
  getFunctionNameByShortName,
} from 'utils';

import {
  CompareToPreviousProps,
  MetricsChartsQueryItemProps,
  MetricsMultiDatePromqlProps,
} from './types';

export const compareToPreviousList = [
  { label: 'Hour', value: '1h', isActive: false },
  { label: 'Day', value: '1d', isActive: false },
  { label: 'Week', value: '1w', isActive: false },
  { label: 'Month', value: '1M', isActive: false },
  { label: 'Quarter', value: '3M', isActive: false },
];

export const predefinedFunctions = [
  { label: 'Basic Anomalies', value: 'anomalies', isActive: false },
  { label: 'Seasonal Anomalies', value: 'anomalies', isActive: false },
  { label: 'Agile Anomalies', value: 'anomalies', isActive: false },
  { label: 'Outliers', value: 'outliers', isActive: false },
  { label: 'Histogram Quantile', value: 'histogram_quantile', isActive: false },
  { label: 'Derivative', value: 'deriv', isActive: false },
];

const getTimeDiffInSeconds = (code: string) => {
  switch (code) {
    case '1h':
      return 3600;
    case '1d':
      return 86400;
    case '1w':
      return 604800;
    case '1M':
      return 2592000;
    case '3M':
      return 7776000;
    default:
      return 0;
  }
};

export const getPreviousTimeRangeWithPromql = (
  compareToPrev: CompareToPreviousProps[],
  date: DateSelection,
  promql: string,
): MetricsMultiDatePromqlProps[] => {
  const promqlQueries: MetricsMultiDatePromqlProps[] = [];
  const { startTimeUnix, endTimeUnix } = date;

  compareToPrev.forEach(({ isActive, label, value }) => {
    if (isActive) {
      const timeDiff = getTimeDiffInSeconds(value);
      const newStartTimeUnix = startTimeUnix - timeDiff;
      const newEndTimeUnix = endTimeUnix - timeDiff;

      promqlQueries.push({
        date: { startTimeUnix: newStartTimeUnix, endTimeUnix: newEndTimeUnix },
        promql,
        label: `${label.toLocaleLowerCase()}_ago`,
      });
    }
  });

  return promqlQueries;
};

export const getPromqlQueryByIndex = (
  queryItem: MetricsChartsQueryItemProps,
  activeFunction: CompareToPreviousProps,
): string => {
  const { formulas, queries, queryIndex, type } = queryItem;
  if (type === 'query') {
    const query = { ...queries[queryIndex] };
    const functions = [...query.functions];

    if (!query.metric) {
      return '';
    }

    if (activeFunction) {
      const { label, value } = activeFunction;
      const funtionParams = getFunctionParams(value);
      if (value === 'anomalies') {
        if (label === 'Seasonal Anomalies') {
          funtionParams[0].value = 'robust';
        }

        if (label === 'Agile Anomalies') {
          funtionParams[0].value = 'agile';
        }
      }
      const functionName = getFunctionNameByShortName(value);
      functions.push({
        name: value,
        params: funtionParams,
        vectorType: functionName.vectorType,
      });
      query.functions = functions;
    }

    const promqlQuery = buildPromqlWithFunctions(query);
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

export const getSeriesShownState = (series: Series[]) => {
  if (!series) return {};

  const seriesBitmap: { [key: string]: boolean } = {};
  series.forEach((item) => {
    seriesBitmap[item.label] = item.show;
  });

  return seriesBitmap;
};

/**
 * Transform the data from the API to the format that the chart needs
 */
export const transformMetricsExplorerData = (
  datasets: Array<{ data: any; series: Series[] }>,
  promqlQueries: MetricsMultiDatePromqlProps[],
  seriesBitmap: { [key: string]: boolean },
): { data: number[][]; series: Series[] } => {
  const transformedData: number[][] = [];
  const transformedSeries: Series[] = [];

  datasets.forEach((dataset, index) => {
    const { data, series } = dataset;
    const { label } = promqlQueries[index];

    if (index === 0) {
      transformedData.push(...data);
      transformedSeries.push(
        ...series.map((item: Series) => {
          const seriesShow =
            seriesBitmap[item.label] !== undefined
              ? seriesBitmap[item.label]
              : true;
          return { ...item, show: seriesShow };
        }),
      );
      return;
    }

    data.map((item: any, idx: number) => {
      if (idx === 0) return item;
      transformedData.push(item);
    });

    const transformedSeriesItem = series.map((item: Series, idx) => {
      const seriesShow =
        seriesBitmap[item.label] !== undefined
          ? seriesBitmap[item.label]
          : true;
      return {
        ...item,
        dash: [4, 8],
        label: `${label}(${item.label})`,
        stroke: chartColors[(idx + index + 1) % chartColors.length],
        show: seriesShow,
      };
    });

    transformedSeries.push(...transformedSeriesItem);
  });

  return { data: transformedData, series: transformedSeries };
};

export const onCreateAlert = (
  date: DateSelection,
  queryItem: MetricsChartsQueryItemProps,
) => {
  const { formulas, queries, queryIndex, type } = queryItem;
  const encodeAlertTypeURI = encodeURIComponent(
    JSON.stringify({ value: 'metrics' }),
  );
  const encodeDateURI = encodeURIComponent(JSON.stringify(date));

  if (type === 'query') {
    const query = { ...queries[queryIndex] };
    const encodeQueryURI = encodeURIComponent(JSON.stringify([query]));
    window.open(
      `/#/alerts/create?alertType=${encodeAlertTypeURI}&metricsQueries=${encodeQueryURI}&date=${encodeDateURI}`,
      '_blank',
    );
    return;
  }

  const encodeFormulaURI = encodeURIComponent(JSON.stringify(formulas));
  const encodeQueryURI = encodeURIComponent(JSON.stringify(queries));

  window.open(
    `/#/alerts/create?alertType=${encodeAlertTypeURI}&metricsQueries=${encodeQueryURI}&metricsFormulas=${encodeFormulaURI}&date=${encodeDateURI}`,
    '_blank',
  );
};

export const onCreateAlertCombined = (
  date: DateSelection,
  formulas: FormulaProps[],
  queries: ExplorerQueryProps[],
) => {
  const encodeFormulaURI = encodeURIComponent(JSON.stringify(formulas));
  const encodeQueryURI = encodeURIComponent(JSON.stringify(queries));
  const encodeAlertTypeURI = encodeURIComponent(
    JSON.stringify({ value: 'metrics' }),
  );
  const encodeDateURI = encodeURIComponent(JSON.stringify(date));
  window.open(
    `/#/alerts/create?alertType=${encodeAlertTypeURI}&metricsQueries=${encodeQueryURI}&metricsFormulas=${encodeFormulaURI}&date=${encodeDateURI}`,
    '_blank',
  );
};
