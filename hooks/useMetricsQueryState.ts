import { AutocompleteOption, useToastmasterContext } from 'components';
import {
  useLocalStorageState,
  useRequest,
  useToggle,
  useUrlState,
} from 'hooks';
import { debounce } from 'lodash';
import { getMetricsList, promqlSeries, promqlQueryRange } from 'requests';
import { useEffect, useState } from 'react';
import {
  ChartProps,
  DateSelection,
  ExplorerQueryProps,
  FormulaProps,
  VectorTypes,
} from 'types';
import {
  getMetricsExplorerDefaultChart,
  getMetricsExplorerDefaultQuery,
} from 'utils';
import {
  AGGREGATE_FUNCTIONS,
  buildFormulaQuery,
  buildPromqlWithFunctions,
  getFunctionParams,
  transformSeriesList,
  validateArithmeticFormulas,
  validateQuery,
} from 'utils/MetricsQueryBuilder';

const useMetricsQueryState = (
  date: DateSelection,
  onAPICall?: (queryItem: any) => void,
  onRemoveQueryOrFormula?: (queryItem: any) => void,
) => {
  const { addToast } = useToastmasterContext();
  const [absoluteTimeRangeStorage, setabsoluteTimeRangeStorage] =
    useLocalStorageState('AbsoluteTimeRange', []);

  const [charts, setCharts] = useUrlState('chartQueries', [
    getMetricsExplorerDefaultChart('', 0),
  ]);

  const toggleAddFormula = useToggle(false);
  const [metricsList, setMetricsList] = useState([]);
  const [seriesList, setSeriesList] = useState<{
    [key: string]: AutocompleteOption[];
  }>({});
  const [labelValueList, setLabelValueList] = useState<{
    [key: string]: { [key: string]: AutocompleteOption[] };
  }>({});
  const [labelsList, setLabelsList] = useState<{
    [key: string]: AutocompleteOption[];
  }>({});
  const [chartData, setChartData] = useState<{
    [key: string]: { data: any[]; maxValue?: number; series: any[] };
  }>({ chart_1: { data: [], series: [] } });

  const getMetricsListRequest = useRequest(getMetricsList);
  const promqlSeriesRequest = useRequest(promqlSeries);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);

  const addChart = () => {
    setCharts((prevCharts: ChartProps[]) => {
      const newChart: ChartProps = getMetricsExplorerDefaultChart(
        '',
        prevCharts.length,
      );
      return [...prevCharts, newChart];
    });
  };

  const addQuery = (chartIndex: number, queryKey: string) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const newQueries = [...newCharts[chartIndex].queries];
      newQueries.push({ ...getMetricsExplorerDefaultQuery(''), queryKey });
      newCharts[chartIndex].queries = newQueries;
      return newCharts;
    });
  };

  const addFormula = (chartIndex: number) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const newFormulas = [...newCharts[chartIndex].formulas];
      newFormulas.push({ expression: '', isValid: false });
      newCharts[chartIndex].formulas = newFormulas;
      return newCharts;
    });
  };

  const addFunction = (
    chartIndex: number,
    queryIndex: number,
    functionName: string,
    vectorType: VectorTypes,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const { chartId, formulas, queries } = newCharts[chartIndex];
      const functionParams = getFunctionParams(functionName);

      const newQueries = [...newCharts[chartIndex].queries];
      const newFunctions = [...newQueries[queryIndex].functions];
      newFunctions.push({
        name: functionName,
        params: functionParams,
        vectorType,
      });
      newQueries[queryIndex].functions = newFunctions;
      newCharts[chartIndex].queries = newQueries;
      callPromqlQuery(
        chartId,
        chartIndex,
        formulas,
        queries,
        queryIndex,
        'query',
      );
      return newCharts;
    });
  };

  const updateQuery = (
    chartIndex: number,
    queryIndex: number,
    propertyKey: string,
    value: any,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const newQueries = [...newCharts[chartIndex].queries];
      const newQuery = { ...newQueries[queryIndex] };

      if (propertyKey === 'metric') {
        newQuery.labels = [];
        newQuery.series = ['=""'];
        callSeriesQuery(chartIndex, value);
      }

      newQuery[propertyKey] = value;
      newQueries[queryIndex] = newQuery;
      newCharts[chartIndex].queries = newQueries;
      const { chartId, formulas, queries } = newCharts[chartIndex];
      if (
        propertyKey !== 'showInput' &&
        propertyKey !== 'isActive' &&
        propertyKey !== 'steps'
      ) {
        callPromqlQuery(
          chartId,
          chartIndex,
          formulas,
          queries,
          queryIndex,
          'query',
        );
      }

      if (propertyKey === 'steps') {
        debounce(
          () =>
            callPromqlQuery(
              chartId,
              chartIndex,
              formulas,
              queries,
              queryIndex,
              'query',
            ),
          2000,
        )();
      }

      if (propertyKey === 'isActive') {
        setChartData((prevChartData) => ({ ...prevChartData }));
      }
      return newCharts;
    });
  };

  const appendOrUpdateAggregation = (
    chartIndex: number,
    queryIndex: number,
    metricName: string,
    tag: string,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const newQueries = [...newCharts[chartIndex].queries];
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
            newFunctions[aggrIndex].params[1].value = [...existingTags, tag];
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
        newQueries[queryIndex].functions = newFunctions;
      }

      newCharts[chartIndex].queries = newQueries;
      const { chartId, formulas, queries } = newCharts[chartIndex];
      callPromqlQuery(
        chartId,
        chartIndex,
        formulas,
        queries,
        queryIndex,
        'query',
      );
      return newCharts;
    });
  };

  const updateFormula = (
    chartIndex: number,
    formulaIndex: number,
    propertyKey: string,
    value: any,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const { chartId, formulas, queries } = newCharts[chartIndex];
      const queryKeys = queries.map((query) => query.queryKey);
      const isValid = validateArithmeticFormulas(value, queryKeys);
      if (isValid) {
        debounce(
          () =>
            callPromqlQuery(
              chartId,
              chartIndex,
              formulas,
              queries,
              formulaIndex,
              'formula',
            ),
          2000,
        )();
      }
      const newFormulas = [...newCharts[chartIndex].formulas];
      newFormulas[formulaIndex][propertyKey] = value;
      newFormulas[formulaIndex].isValid = isValid;
      newCharts[chartIndex].formulas = newFormulas;
      return newCharts;
    });
  };

  const updateFunction = (
    chartIndex: number,
    queryIndex: number,
    fnIndex: number,
    paramIndex: number,
    value: any,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const { chartId, formulas, queries } = newCharts[chartIndex];
      const newQueries = [...newCharts[chartIndex].queries];
      const newFunctions = [...newQueries[queryIndex].functions];

      if (
        AGGREGATE_FUNCTIONS.includes(newFunctions[fnIndex].name) &&
        paramIndex === 0
      ) {
        if (value === 'quantile') {
          newFunctions[fnIndex].params.push({
            name: 'quantile',
            default: 0.99,
            value: 0.99,
            type: 'text',
          });
        } else {
          newFunctions[fnIndex].params = newFunctions[fnIndex].params.filter(
            (param) => param.name !== 'quantile',
          );
        }
      }

      newFunctions[fnIndex].params[paramIndex].value = value;
      newQueries[queryIndex].functions = newFunctions;
      newCharts[chartIndex].queries = newQueries;
      if (newFunctions[fnIndex].params[paramIndex].type === 'text') {
        debounce(
          () =>
            callPromqlQuery(
              chartId,
              chartIndex,
              formulas,
              queries,
              queryIndex,
              'query',
            ),
          2000,
        )();
      } else {
        callPromqlQuery(
          chartId,
          chartIndex,
          formulas,
          queries,
          queryIndex,
          'query',
        );
      }
      return newCharts;
    });
  };

  const updateChart = (chartIndex: number, propertyKey: string, value: any) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      newCharts[chartIndex][propertyKey] = value;
      return newCharts;
    });
  };

  const removeQuery = (chartIndex: number, queryIndex: number) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const { chartId, formulas, queries } = newCharts[chartIndex];
      if (queries.length === 1) {
        addToast({ status: 'error', text: 'Cannot remove query last query' });
        return prevCharts;
      }

      if (queries[queryIndex].metric !== '') {
        callPromqlQuery(chartId, chartIndex, formulas, queries);
        onRemoveQueryOrFormula &&
          onRemoveQueryOrFormula({ queryIndex, type: 'query' });
      }
      const newQueries = [...newCharts[chartIndex].queries];
      newQueries.splice(queryIndex, 1);
      newCharts[chartIndex].queries = newQueries;
      return newCharts;
    });
  };

  const removeFormula = (chartIndex: number, formulaIndex: number) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const { chartId, formulas, queries } = newCharts[chartIndex];
      if (formulas[formulaIndex].expression !== '') {
        callPromqlQuery(chartId, chartIndex, formulas, queries);
        onRemoveQueryOrFormula &&
          onRemoveQueryOrFormula({ queryIndex: formulaIndex, type: 'formula' });
      }

      const newFormulas = [...newCharts[chartIndex].formulas];
      newFormulas.splice(formulaIndex, 1);
      newCharts[chartIndex].formulas = newFormulas;
      return newCharts;
    });
  };

  const removeFunction = (
    chartIndex: number,
    queryIndex: number,
    functionIndex: number,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const { chartId, formulas, queries } = newCharts[chartIndex];
      const newQueries = [...newCharts[chartIndex].queries];
      const newFunctions = [...newQueries[queryIndex].functions];
      newFunctions.splice(functionIndex, 1);
      newQueries[queryIndex].functions = newFunctions;
      newCharts[chartIndex].queries = newQueries;
      callPromqlQuery(
        chartId,
        chartIndex,
        formulas,
        queries,
        queryIndex,
        'query',
      );
      return newCharts;
    });
  };

  const removeChart = (chartIndex: number) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      if (newCharts.length === 1) {
        addToast({
          status: 'error',
          text: 'Cannot remove last chart',
        });
        return prevCharts;
      }
      newCharts.splice(chartIndex, 1);
      return newCharts;
    });
  };

  const updateLabelMultiOperation = (
    chartIndex: number,
    queryIndex: number,
    labelIndex: number,
    value: string,
  ) => {
    setCharts((prevCharts: ChartProps[]) => {
      const newCharts = [...prevCharts];
      const newQueries = [...newCharts[chartIndex].queries];
      const newQuery = { ...newQueries[queryIndex] };

      newQuery.series[labelIndex] = value;
      newQueries[queryIndex] = newQuery;
      newCharts[chartIndex].queries = newQueries;

      if (value !== '=""') {
        const { chartId, formulas, queries } = newCharts[chartIndex];
        debounce(
          () =>
            callPromqlQuery(
              chartId,
              chartIndex,
              formulas,
              queries,
              queryIndex,
              'query',
            ),
          2000,
        )();
      }
      return newCharts;
    });
  };

  const callPromqlQuery = (
    chartId: string,
    chartIndex: number,
    formulas: FormulaProps[],
    queries: ExplorerQueryProps[],
    queryIndex?: number,
    type?: 'query' | 'formula',
  ) => {
    if (onAPICall && queryIndex !== undefined && type !== undefined) {
      onAPICall({
        formulas,
        queries,
        queryIndex,
        type,
        steps: queries.map((query) => query.steps),
      });
      return;
    }
    const validatedQueries = validateQuery(queries);
    if (validatedQueries.length > 0) {
      setLoading(chartIndex, true);
      let promqlQueries: string[] = [];
      let metricNames: string[] = [];

      validatedQueries.forEach((query) => {
        const promqlQuery = buildPromqlWithFunctions(query);
        metricNames.push(query.metric);
        promqlQueries.push(promqlQuery);
      });

      // Add formulas to promql queries
      const queryKeys: string[] = queries.map((query) => query.queryKey);
      const formulaQueries = buildFormulaQuery(
        promqlQueries,
        queryKeys,
        formulas,
      );
      promqlQueries = [...promqlQueries, ...formulaQueries];
      metricNames = [...metricNames, ...formulaQueries];

      promqlQueryRangeRequest
        .call({
          date,
          promqlQueries,
          type: 'timeseries',
          metricNames,
          steps: queries.map((query) => query.steps),
        })
        .then((chartDataResponse: any) => {
          if (chartDataResponse) {
            setChartData((prevChartData) => {
              const newChartData = { ...prevChartData };
              newChartData[chartId] = chartDataResponse;
              return newChartData;
            });
            setLoading(chartIndex, false);
          }
        })
        .catch(() => setLoading(chartIndex, false));
    }
  };

  const callSeriesQuery = (chartIndex: number, metricName: string) => {
    if (seriesList[metricName]) {
      return;
    }
    setLoading(chartIndex, false);
    promqlSeriesRequest
      .call({ date, metric: metricName })
      .then((seriesResponse: any) => {
        if (seriesResponse && seriesResponse.status === 'success') {
          const metricName = seriesResponse.data[0].__name__;
          const { labelsListOptions, seriesListOptions, seriesValuesOptions } =
            transformSeriesList(seriesResponse.data);

          setSeriesList((prevSeriesList) => {
            return { ...prevSeriesList, [metricName]: seriesListOptions };
          });
          setLabelValueList((prev) => ({
            ...prev,
            [metricName]: seriesValuesOptions,
          }));
          setLabelsList((prev) => ({
            ...prev,
            [metricName]: labelsListOptions,
          }));
          setLoading(chartIndex, false);
        } else {
          setLoading(chartIndex, false);
          setSeriesList((prev) => ({ ...prev, [metricName]: [] }));
        }
      });
  };

  const setLoading = (chartIndex: number, isLoading: boolean) => {
    if (chartIndex > -1) {
      setCharts((prevCharts: ChartProps[]) => {
        const newCharts = [...prevCharts];
        newCharts[chartIndex].isLoading = isLoading;
        return newCharts;
      });
    }
  };

  const replaceCharts = (newCharts: ChartProps[]) => {
    if (newCharts.length === 0) {
      addToast({ status: 'error', text: 'Failed to load query builder' });
      return;
    }

    reloadChartsDataAndSet(newCharts);
  };

  const reloadChartsDataAndSet = (newCharts: ChartProps[]) => {
    newCharts.forEach((chartQuery: ChartProps, index: number) => {
      const { chartId, formulas, queries } = chartQuery;
      callPromqlQuery(chartId, index, formulas, queries, null, null);
      newCharts[index].isLoading = true;
    });

    newCharts.forEach((chartQuery: ChartProps, index: number) => {
      const { queries } = chartQuery;
      queries.forEach((query) => {
        callSeriesQuery(index, query.metric);
      });
    });
    setCharts(newCharts);
  };

  useEffect(() => {
    charts.forEach((chartQuery: ChartProps, index: number) => {
      const { chartId, formulas, queries } = chartQuery;
      callPromqlQuery(chartId, index, formulas, queries, null, null);
    });

    getMetricsListRequest.call(date).then((metricsListResponse: string[]) => {
      if (metricsListResponse) {
        const metricsListOptions = metricsListResponse.map((metric) => {
          return { value: metric, label: metric };
        });
        setMetricsList(metricsListOptions);
      }
    });
  }, [date]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const chartQueries = new URLSearchParams(
      url.hash.substring(10, url.hash.length),
    ).get('chartQueries');
    if (chartQueries) {
      try {
        const chartQueriesJson = JSON.parse(chartQueries);
        reloadChartsDataAndSet(chartQueriesJson);
        setCharts(chartQueriesJson);
      } catch {
        //
      }
    }
  }, []);

  return {
    absoluteTimeRangeStorage,
    addChart,
    addFormula,
    addFunction,
    addQuery,
    appendOrUpdateAggregation,
    callSeriesQuery,
    charts,
    chartData,
    date,
    getMetricsListRequest,
    promqlQueryRangeRequest,
    labelsList,
    labelValueList,
    metricsList,
    removeChart,
    removeFormula,
    removeFunction,
    removeQuery,
    replaceCharts,
    seriesList,
    setabsoluteTimeRangeStorage,
    toggleAddFormula,
    updateChart,
    updateFormula,
    updateFunction,
    updateLabelMultiOperation,
    updateQuery,
  };
};

export default useMetricsQueryState;
