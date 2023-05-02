import { AutocompleteOption, useToastmasterContext } from 'components';
import { useLocalStorageState, useUrlState } from 'hooks';
import { useEffect } from 'react';
import {
  DateSelection,
  FormulaProps,
  ExplorerQueryProps,
  FunctionProps,
} from 'types';
import {
  AGGREGATE_FUNCTIONS,
  checkIfQueryHasAnomaly,
  getFunctionParams,
  getPromqlQueryByIndex,
  getMetricsExplorerDefaultQuery,
} from 'utils';

import useMetricsDataState from './useMetricsDataState';
import useMetricsFunction from './useMetricsFunctionState';
import useMetricsFormulaState from './useMetricsFormulaState';
import useMetricsQueryOps from './useMetricsQueryOps';

const NON_CALLABLE_PROPS = ['showInput', 'promql', 'isActive', 'steps'];
const DEBOUNCE_CALLABLE_PROPS = ['steps'];

const useMetricsQueryState = ({
  activeQueryType = 'multi',
  defaultQueries = [getMetricsExplorerDefaultQuery('')],
  date,
  onAPICall,
  preAddQuery,
  preLoadMetricList,
  preLoadMetricSeries,
  preReloadQuery,
}: {
  activeQueryType?: 'multi' | 'single';
  defaultQueries?: ExplorerQueryProps[];
  date: DateSelection;
  onAPICall?: (val: {
    formulas: FormulaProps[];
    queryIndex: number;
    queries: ExplorerQueryProps[];
    type: 'query' | 'formula';
  }) => void;
  preAddQuery?: (query: ExplorerQueryProps) => ExplorerQueryProps;
  preLoadMetricList?: (setMetricsList: any) => void;
  preLoadMetricSeries?: (metricName: string) => Promise<{
    labelsListOptions: AutocompleteOption[];
    seriesListOptions: AutocompleteOption[];
    seriesValuesOptions: { [key: string]: AutocompleteOption[] };
  }>;
  preReloadQuery?: (promql: string, metricName: string) => void;
}) => {
  const [queries, setQueries] = useUrlState('metricsQueries', defaultQueries);

  const { addToast } = useToastmasterContext();
  const metricsDataState = useMetricsDataState({
    date,
    onAPICall,
    preLoadMetricSeries,
    preReloadQuery,
  });
  const metricsFormulaState = useMetricsFormulaState(queries, metricsDataState);
  const { checkAndLoadedAffectedFormulas, formulas, setFormulas } =
    metricsFormulaState;

  const metricsFunctionState = useMetricsFunction(
    formulas,
    queries,
    metricsDataState,
    setQueries,
  );

  const {
    callOnePromqlQuery,
    callSeriesQuery,
    getMetricsListRequest,
    queryData,
    reloadMultipleQueries,
    removeQueryData,
    setMetricsList,
    setQueryData,
  } = metricsDataState;

  const queryOperation = useMetricsQueryOps({
    activeQueryType,
    setFormulas,
    setQueries,
    setQueryData,
  });

  const [absoluteTimeRangeStorage, setabsoluteTimeRangeStorage] =
    useLocalStorageState('AbsoluteTimeRange', []);

  const addQuery = () => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const lastQueryKey = newQueries[newQueries.length - 1]?.queryKey || 'a';
      const newQuery = {
        ...getMetricsExplorerDefaultQuery(''),
        queryKey: String.fromCharCode(lastQueryKey.charCodeAt(0) + 1),
      };

      if (preAddQuery) {
        newQueries.push(preAddQuery(newQuery));
        return newQueries;
      }
      newQueries.push(newQuery);
      return newQueries;
    });
  };

  const updateQuery = (queryIndex: number, propertyKey: string, value: any) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const newQuery = { ...newQueries[queryIndex] };

      if (propertyKey === 'metric') {
        newQuery.series = [];
        callSeriesQuery(queryIndex, value);
      }
      newQuery[propertyKey] = value;
      newQueries[queryIndex] = newQuery;

      if (DEBOUNCE_CALLABLE_PROPS.includes(propertyKey)) {
        callOnePromqlQuery(
          formulas,
          newQueries,
          queryIndex,
          'query',
          'debounce',
        );
        checkAndLoadedAffectedFormulas(queryIndex, newQueries, 'debounce');
        return newQueries;
      }

      if (propertyKey === 'isActive') {
        setQueryData({ ...queryData });
        return newQueries;
      }

      if (propertyKey === 'series') {
        const lastSeries = value[value.length - 1];
        if (lastSeries === '=""') {
          return newQueries;
        }
      }

      if (NON_CALLABLE_PROPS.includes(propertyKey)) {
        return newQueries;
      }

      callOnePromqlQuery(formulas, newQueries, queryIndex, 'query');
      checkAndLoadedAffectedFormulas(queryIndex, newQueries, 'normal');
      return newQueries;
    });
  };

  const updateParsedQuery = (
    queryIndex: number,
    metric: string,
    functions: FunctionProps[],
    series: string[],
  ) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const newQuery = { ...newQueries[queryIndex] };

      newQuery.metric = metric;
      newQuery.functions = functions;
      newQuery.series = series;
      newQueries[queryIndex] = newQuery;

      callOnePromqlQuery(formulas, newQueries, queryIndex, 'query');
      checkAndLoadedAffectedFormulas(queryIndex, newQueries, 'normal');
      return newQueries;
    });
  };

  const removeQuery = (queryIndex: number) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      if (queries.length === 1) {
        addToast({ status: 'error', text: 'Cannot remove query last query' });
        return prevQueries;
      }

      if (queries[queryIndex].metric !== '') {
        removeQueryData(queryIndex, 'query', newQueries.length - 1);
      }
      newQueries.splice(queryIndex, 1);
      return newQueries;
    });
  };

  const callMultiplePromqlQueries = (
    newQueries: ExplorerQueryProps[],
    newFormulas: FormulaProps[],
  ) => {
    const promqlQueries: string[] = [];
    const metricMeta: {
      legendFormat?: string;
      metric: string;
      queryId: string;
      step?: number;
    }[] = [];

    newQueries.forEach((query: ExplorerQueryProps, index: number) => {
      const queryItem = { formulas: newFormulas, queries: newQueries };

      if (checkIfQueryHasAnomaly(query)) {
        callOnePromqlQuery(newFormulas, newQueries, index, 'query');
        return;
      }

      const promql = getPromqlQueryByIndex({
        ...queryItem,
        queryIndex: index,
        type: 'query',
      });
      if (!promql) return;
      promqlQueries.push(promql);
      metricMeta.push({
        legendFormat: query.legendFormat,
        metric: `${query.queryKey}__${query.metric}`,
        queryId: `query_${index}`,
        step: query.steps,
      });
    });

    newFormulas.forEach((_, index: number) => {
      const queryItem = { formulas: newFormulas, queries: newQueries };
      const promql = getPromqlQueryByIndex({
        ...queryItem,
        queryIndex: index,
        type: 'formula',
      });

      if (!promql) return;
      promqlQueries.push(promql);
      metricMeta.push({
        metric: `formula_${index}__${promql}`,
        queryId: `formula_${index}`,
      });
    });

    reloadMultipleQueries(metricMeta, promqlQueries);
  };

  const openMetricUsingTags = (
    queryIndex: number,
    metricName: string,
    tag: string,
  ) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const newQuery = { ...newQueries[queryIndex] };
      const { metric, functions } = newQuery;

      if (metricName !== metric) {
        const newDefaultQuery = getMetricsExplorerDefaultQuery(metricName);
        newDefaultQuery.functions[0].params[1].value.push(tag);
        newQueries[queryIndex] = newDefaultQuery;
      }

      if (metricName === metric) {
        const newFunctions = [...functions];
        const aggrIndex = newFunctions.findIndex((func) =>
          AGGREGATE_FUNCTIONS.includes(func.name),
        );
        if (aggrIndex !== -1) {
          const existingTags = newFunctions[aggrIndex].params[1].value;
          if (!existingTags.includes(tag)) {
            newFunctions[aggrIndex].params[1].value.push(tag);
          }
        } else {
          const functionParams = getFunctionParams('avg_by');
          functionParams[1].value.push(tag);
          newFunctions.push({
            name: 'avg_by',
            params: functionParams,
            vectorType: 'instant',
          });
        }
        newQuery.functions = newFunctions;
      }

      callOnePromqlQuery(formulas, newQueries, queryIndex, 'query');
      return newQueries;
    });
  };

  const updateSeries = (
    queryIndex: number,
    seriesIndex: number,
    value: string,
  ) => {
    setQueries((prevQueries: ExplorerQueryProps[]) => {
      const newQueries = [...prevQueries];
      const newQuery = { ...newQueries[queryIndex] };

      newQuery.series[seriesIndex] = value;
      newQueries[queryIndex] = newQuery;

      if (value !== '=""') {
        callOnePromqlQuery(
          formulas,
          newQueries,
          queryIndex,
          'query',
          'debounce',
        );
        checkAndLoadedAffectedFormulas(queryIndex, newQueries, 'debounce');
      }
      return newQueries;
    });
  };

  useEffect(() => {
    callMultiplePromqlQueries(queries, formulas);

    if (preLoadMetricList) {
      preLoadMetricList(setMetricsList);
    } else {
      getMetricsListRequest.call(date).then((metricsListResponse: string[]) => {
        if (metricsListResponse) {
          const metricsListOptions = metricsListResponse.map((metric) => {
            return { value: metric, label: metric };
          });
          setMetricsList(metricsListOptions);
        }
      });
    }
  }, [date]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const metricsQueries = new URLSearchParams(
      url.hash.substring(10, url.hash.length),
    ).get('metricsQueries');
    const metricsFormulas = new URLSearchParams(
      url.hash.substring(10, url.hash.length),
    ).get('metricsFormulas');

    if (metricsQueries) {
      try {
        const metricsQueriesJSON = JSON.parse(metricsQueries || '[]');
        const metricsFormulasJSON = JSON.parse(metricsFormulas || '[]');

        metricsQueriesJSON.forEach(
          (query: ExplorerQueryProps, index: number) => {
            callSeriesQuery(index, query.metric);
            callOnePromqlQuery(formulas, queries, index, 'query');
          },
        );

        metricsFormulasJSON.forEach((f: FormulaProps, index: number) => {
          callOnePromqlQuery(formulas, queries, index, 'formula');
        });
      } catch {
        //
      }
    }
  }, []);

  return {
    absoluteTimeRangeStorage,
    activeQueryType,
    addQuery,
    callSeriesQuery,
    callMultiplePromqlQueries,
    date,
    formulas,
    openMetricUsingTags,
    removeQuery,
    queries,
    setabsoluteTimeRangeStorage,
    updateQuery,
    updateParsedQuery,
    updateSeries,
    setQueries,
    ...queryOperation,
    ...metricsDataState,
    ...metricsFormulaState,
    ...metricsFunctionState,
  };
};

export default useMetricsQueryState;
