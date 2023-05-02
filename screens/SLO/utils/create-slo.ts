import {
  ExplorerQueryProps,
  FormulaProps,
  SLOAlertDataProps,
  SLOAlertInputProps,
} from 'types';
import {
  getFunctionParams,
  getPromqlQueryByIndex,
  transformSeriesList,
} from 'utils';

import { SLOCountValueThreshold } from '../types';

const apmMetricSeries = [
  'method',
  'service_name',
  'span_kind',
  'status_code',
  'span_name',
  'span_type',
];

export const getFilteredSeriesList = (data: Array<any>) => {
  const { labelsListOptions, seriesListOptions, seriesValuesOptions } =
    transformSeriesList(data);

  const filteredLabelsListOptions = labelsListOptions.filter(({ label }) =>
    apmMetricSeries.includes(label),
  );

  const filteredSeriesListOptions = seriesListOptions.filter(({ label }) =>
    apmMetricSeries.includes(label),
  );

  const seriesValuesOptionsKeys = Object.keys(seriesValuesOptions);
  const filteredSeriesValuesOptions = seriesValuesOptionsKeys.reduce(
    (acc, key) => {
      if (apmMetricSeries.includes(key)) {
        acc[key] = seriesValuesOptions[key];
      }
      return acc;
    },
    {},
  );

  return {
    labelsListOptions: filteredLabelsListOptions,
    seriesListOptions: filteredSeriesListOptions,
    seriesValuesOptions: filteredSeriesValuesOptions,
  };
};

const getSLONumeDenoPromql = ({
  options,
  useType,
  queryState,
}: {
  options: SLOCountValueThreshold;
  queryState: { queries: ExplorerQueryProps[]; formulas: FormulaProps[] };
  useType: 'create' | 'load';
}) => {
  let service = '';
  let sloType = 'availability';
  const newQueries = JSON.parse(JSON.stringify(queryState.queries));
  const newFormulas = JSON.parse(JSON.stringify(queryState.formulas));

  const { queryIndex, type } = getFirstActiveQueryOrFormula({
    formulas: newFormulas,
    queries: newQueries,
  });

  if (newQueries[queryIndex].metric === 'span_latency_ms_bucket') {
    sloType = 'latency';
  }

  const newQuery = newQueries[queryIndex];
  const newFunctions = newQuery.functions;

  const evalFuncName = useType === 'load' ? 'increase' : 'rate_per_second';
  newFunctions.unshift({ name: 'sum', params: null, vectorType: 'instant' });
  const rateFuncParams = getFunctionParams(evalFuncName);
  rateFuncParams[0].value = useType === 'load' ? '1d' : '{{.window}}';
  newFunctions.unshift({
    name: evalFuncName,
    params: rateFuncParams,
    vectorType: 'range',
  });

  if (sloType === 'latency' && options.threshold) {
    const newSeries = [...newQuery.series];
    newSeries.push(`le="${options.threshold}"`);
    newQuery.series = newSeries;
  }

  const promql = getPromqlQueryByIndex({
    formulas: newFormulas,
    queries: newQueries,
    queryIndex,
    type,
  });

  if (type === 'formula') {
    service = getServiceFromMetricSeries(newQueries[0].series);
  }

  if (type === 'query') {
    service = getServiceFromMetricSeries(newQueries[queryIndex].series);
  }

  return { promql, service, sloType };
};

export const buildSLOPromql = ({
  denoQueryState,
  numeQueryState,
  options,
  useType,
}: {
  denoQueryState: { queries: ExplorerQueryProps[]; formulas: FormulaProps[] };
  numeQueryState: { queries: ExplorerQueryProps[]; formulas: FormulaProps[] };
  options: { nume: SLOCountValueThreshold; deno: SLOCountValueThreshold };
  useType: 'create' | 'load';
}): {
  goodEventsPromql: string;
  badEventsPromql: string;
  service: string;
} => {
  const { promql: numePromql, service } = getSLONumeDenoPromql({
    options: options.nume,
    queryState: numeQueryState,
    useType,
  });
  const { promql: denoPromql, sloType } = getSLONumeDenoPromql({
    options: options.deno,
    queryState: denoQueryState,
    useType,
  });

  /**
   * Before making changes to this logic, please read the following:
   * https://github.com/kloudfuse/ui/issues/1183
   */
  let goodEventsPromql = '';
  let badEventsPromql = '';
  if (sloType === 'latency' && useType === 'load') {
    badEventsPromql = `${denoPromql} - ${numePromql}`;
    goodEventsPromql = numePromql;
  }

  if (sloType === 'latency' && useType === 'create') {
    goodEventsPromql = denoPromql;
    badEventsPromql = `${denoPromql} - ${numePromql}`;
  }

  if (sloType === 'availability' && useType === 'load') {
    goodEventsPromql = `${denoPromql} - ${numePromql}`;
    badEventsPromql = numePromql;
  }

  if (sloType === 'availability' && useType === 'create') {
    goodEventsPromql = denoPromql;
    badEventsPromql = numePromql;
  }

  return { goodEventsPromql, badEventsPromql, service };
};

export const getServiceFromMetricSeries = (series: string[]) => {
  for (let index = 0; index < series.length; index++) {
    const element = series[index];
    if (element.startsWith('service_name')) {
      const service = element.split('=')[1];
      return service.replace(/['"]+/g, '');
    }
  }
  return '';
};

export const getFirstActiveQueryOrFormula = ({
  formulas,
  queries,
}: {
  formulas: FormulaProps[];
  queries: ExplorerQueryProps[];
}): {
  queryIndex: number;
  type: 'query' | 'formula';
} => {
  const queryIndex = queries.findIndex((query) => query.isActive);
  if (queryIndex !== -1) {
    return { queryIndex, type: 'query' };
  }

  const formulaIndex = formulas.findIndex((formula) => formula.isActive);
  if (formulaIndex !== -1) {
    return { queryIndex: formulaIndex, type: 'formula' };
  }

  return null;
};

export const getAlertsDetailForCreateSLO = ({
  low,
  high,
}: {
  high: SLOAlertDataProps;
  low: SLOAlertDataProps;
}): {
  pageAlertInput: SLOAlertInputProps;
  ticketAlertInput: SLOAlertInputProps;
} => {
  const highSLOLabels: SLOAlertInputProps['Labels'] = [];
  if (high.labels) {
    high.labels.forEach((label) => {
      if (label.key && label.value)
        highSLOLabels.push({ Name: label.key, Value: label.value });
    });
  }

  const highContactPoints = high.contactPoints.map((contactPoint) => ({
    Name: contactPoint,
    Value: 'true',
  }));
  const pageAlertInput: SLOAlertInputProps = {
    Name: high.name,
    Annotations: [
      { Name: 'description', Value: high.description || '' },
      { Name: 'ruleType', Value: 'slo' },
    ],
    Labels: [...highSLOLabels, ...highContactPoints],
  };

  const lowSLOLabels: SLOAlertInputProps['Labels'] = [];
  if (low.labels) {
    low.labels.forEach((label) => {
      if (label.key && label.value)
        lowSLOLabels.push({ Name: label.key, Value: label.value });
    });
  }

  const lowContactPoints = low.contactPoints.map((contactPoint) => ({
    Name: contactPoint,
    Value: 'true',
  }));
  const ticketAlertInput: SLOAlertInputProps = {
    Name: low.name,
    Annotations: [
      { Name: 'description', Value: low.description || '' },
      { Name: 'ruleType', Value: 'slo' },
    ],
    Labels: [...lowSLOLabels, ...lowContactPoints],
  };

  return { pageAlertInput, ticketAlertInput };
};
