import { AutocompleteOption } from 'components';
import { useRequest } from 'hooks';
import { debounce } from 'lodash';
import { useState } from 'react';
import { getMetricsList, promqlQueryRange, promqlSeries } from 'requests';
import {
  DateSelection,
  ExplorerQueryProps,
  FormulaProps,
  MetricsQueriesDataProps,
} from 'types';

import {
  checkIfQueryHasAnomaly,
  getPromqlQueryByIndex,
  formatChartLegend,
  transformSeriesList,
} from 'utils';

const useMetricsDataState = ({
  date,
  onAPICall,
  preLoadMetricSeries,
  preReloadQuery,
}: {
  date: DateSelection;
  onAPICall?: (val: {
    formulas: FormulaProps[];
    queryIndex: number;
    queries: ExplorerQueryProps[];
    type: 'query' | 'formula';
  }) => void;
  preLoadMetricSeries?: (metricName: string) => Promise<{
    labelsListOptions: AutocompleteOption[];
    seriesListOptions: AutocompleteOption[];
    seriesValuesOptions: { [key: string]: AutocompleteOption[] };
  }>;
  preReloadQuery?: (promql: string, metricName: string) => void;
}) => {
  const [queryData, setQueryData] = useState<MetricsQueriesDataProps>({});
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

  const getMetricsListRequest = useRequest(getMetricsList);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);
  const promqlSeriesRequest = useRequest(promqlSeries);

  const reloadMultipleQueries = async (
    metricMeta: Array<{
      legendFormat: string;
      metric: string;
      queryId: string;
      step?: number;
    }>,
    promqlQueries: string[],
  ) => {
    setQueryData((prev) => {
      const newQueryData = { ...prev };
      metricMeta.forEach((meta) => {
        newQueryData[meta.queryId] = { isLoading: true };
      });
      return newQueryData;
    });
    const datasets = await Promise.all(
      promqlQueries.map((promql, index) => {
        const { legendFormat, metric, step } = metricMeta[index];
        return promqlQueryRangeRequest
          .call({
            date,
            promqlQueries: [
              preReloadQuery ? preReloadQuery(promql, metric) : promql,
            ],
            type: 'timeseries',
            metricNames: [metric],
            steps: step ? [step] : undefined,
            seriesFormatter: legendFormat
              ? (idx: number, promIndex: number, metric: any) => {
                  return formatChartLegend(idx, metric, legendFormat);
                }
              : undefined,
          })
          .catch(() => {});
      }),
    );

    const newQueryData: { [key: string]: any } = {};
    datasets.forEach((dataset, index) => {
      newQueryData[`${metricMeta[index].queryId}`] = {
        isLoading: false,
        data: dataset,
      };
    });
    setQueryData(newQueryData);
  };

  const reloadOneQuery = ({
    metricName,
    promql,
    queryIndex,
    type,
    step,
  }: {
    metricName: string;
    promql: string;
    queryIndex: number;
    type: 'query' | 'formula';
    step?: number;
  }) => {
    if (queryIndex < 0 || !promql) return;
    const queryId = `${type}_${queryIndex}`;
    setQueryData((prev) => ({ ...prev, [queryId]: { isLoading: true } }));
    promqlQueryRangeRequest
      .call({
        date,
        promqlQueries: [
          preReloadQuery ? preReloadQuery(promql, metricName) : promql,
        ],
        type: 'timeseries',
        metricNames: [metricName],
        steps: [step],
      })
      .then((res) => {
        setQueryData((prev) => {
          const newQueryData = { ...prev };
          newQueryData[queryId] = { isLoading: false, data: res };

          if (newQueryData[`${queryId}_anomaly`]) {
            delete newQueryData[`${queryId}_anomaly`];
            delete newQueryData[`${queryId}_anomaly_lower`];
            delete newQueryData[`${queryId}_anomaly_upper`];
          }

          return newQueryData;
        });
      })
      .catch(() => {
        setQueryData((prev) => ({
          ...prev,
          [queryId]: { data: {}, isLoading: false },
        }));
      });
  };

  const loadAnomaliesData = async ({
    metricName,
    promql,
    queryIndex,
    type,
    step,
  }: {
    metricName: string;
    promql: string[];
    queryIndex: number;
    type: 'query' | 'formula';
    step?: number;
  }) => {
    if (queryIndex < 0 || !promql) return;
    const queryId = `${type}_${queryIndex}_anomaly`;
    setQueryData((prev) => ({ ...prev, [queryId]: { isLoading: true } }));

    const metricNames = [
      metricName,
      `lower_bound(${metricName})`,
      `upper_bound${metricName}`,
    ];
    const datasets = await Promise.all(
      promql.map((p, idx) => {
        return promqlQueryRangeRequest
          .call({
            date,
            promqlQueries: [preReloadQuery ? preReloadQuery(p, metricName) : p],
            type: 'timeseries',
            metricNames: [metricNames[idx]],
            steps: [step],
          })
          .catch(() => {});
      }),
    );

    const queryKeys = ['', '_lower', '_upper'];
    const newQueryDataAnomaly: { [key: string]: any } = {};
    datasets.forEach((dataset, index) => {
      newQueryDataAnomaly[`${queryId}${queryKeys[index]}`] = {
        isLoading: false,
        data: dataset,
      };
    });

    setQueryData((prev) => {
      const newQueryData = { ...prev, ...newQueryDataAnomaly };
      const prevQueryId = `${type}_${queryIndex}`;

      if (newQueryData[prevQueryId]) {
        delete newQueryData[prevQueryId];
      }
      return newQueryData;
    });
  };

  const callSeriesQuery = (queryIndex: number, metricName: string) => {
    if (!metricName) return;

    if (seriesList[metricName]) {
      return;
    }
    hanldeLoading(queryIndex, false);

    if (preLoadMetricSeries) {
      preLoadMetricSeries(metricName).then((res) => {
        const { labelsListOptions, seriesListOptions, seriesValuesOptions } =
          res;
        setSeriesList((prevSeriesList) => ({
          ...prevSeriesList,
          [metricName]: seriesListOptions,
        }));
        setLabelValueList((prev) => ({
          ...prev,
          [metricName]: seriesValuesOptions,
        }));
        setLabelsList((prev) => ({
          ...prev,
          [metricName]: labelsListOptions,
        }));
        hanldeLoading(queryIndex, false);
      });
      return;
    }

    promqlSeriesRequest
      .call({ date, metric: metricName })
      .then((seriesResponse: any) => {
        if (seriesResponse && seriesResponse.status === 'success') {
          const metricName = seriesResponse.data[0].__name__;
          const { labelsListOptions, seriesListOptions, seriesValuesOptions } =
            transformSeriesList(seriesResponse.data);

          setSeriesList((prevSeriesList) => ({
            ...prevSeriesList,
            [metricName]: seriesListOptions,
          }));
          setLabelValueList((prev) => ({
            ...prev,
            [metricName]: seriesValuesOptions,
          }));
          setLabelsList((prev) => ({
            ...prev,
            [metricName]: labelsListOptions,
          }));
          hanldeLoading(queryIndex, false);
        } else {
          hanldeLoading(queryIndex, false);
          setSeriesList((prev) => ({ ...prev, [metricName]: [] }));
        }
      });
  };

  const hanldeLoading = (queryIndex: number, isLoading: boolean) => {
    setQueryData((prevQueryData) => {
      const newQueryData = { ...prevQueryData };
      const key = `query_${queryIndex}`;
      newQueryData[key] = { ...newQueryData[key], isLoading };
      return newQueryData;
    });
  };

  const callOnePromqlQuery = (
    formulas: FormulaProps[],
    queries: ExplorerQueryProps[],
    queryIndex?: number,
    type?: 'query' | 'formula',
    callType: 'debounce' | 'normal' = 'normal',
  ) => {
    if (onAPICall) {
      onAPICall({ formulas, queries, queryIndex, type });
      return;
    }

    const isAnomalyExist = checkIfQueryHasAnomaly(queries[queryIndex]);
    const promql = getPromqlQueryByIndex({
      formulas,
      queries,
      queryIndex,
      type,
      returnType: isAnomalyExist ? 'array' : 'string',
    });

    let metricName = '';
    if (type === 'query') {
      metricName = `${queries[queryIndex].queryKey}__${queries[queryIndex].metric}`;
    } else {
      metricName = `formula_${queryIndex}__${promql}`;
    }

    const queryItem = {
      metricName,
      promql,
      queryIndex,
      type,
      step: queries[queryIndex]?.steps,
    };

    if (isAnomalyExist && type === 'query') {
      if (callType === 'debounce') {
        debounce(() => loadAnomaliesData(queryItem), 2000)();
      } else {
        loadAnomaliesData(queryItem);
      }
      return;
    }

    if (callType === 'debounce') {
      debounce(() => reloadOneQuery(queryItem), 2000)();
    } else {
      reloadOneQuery(queryItem);
    }
  };

  const removeQueryDataAndRestructure = (
    newQueryData: MetricsQueriesDataProps,
    index: number,
    queriesLength: number,
    prefix: 'query' | 'formula',
  ) => {
    const keysToRemove: string[] = [];
    const updatedKeys: MetricsQueriesDataProps = {};

    for (const key in newQueryData) {
      if (!key.startsWith(prefix)) continue;
      const [type, queryIndex] = key.split('_');
      const queryIndexNumber = Number(queryIndex);
      if (
        queryIndexNumber === index ||
        queryIndexNumber < 0 ||
        queryIndexNumber > queriesLength
      ) {
        keysToRemove.push(key);
      } else if (queryIndexNumber > index) {
        updatedKeys[`${type}_${queryIndexNumber - 1}`] = newQueryData[key];
      } else {
        continue;
      }
    }

    keysToRemove.forEach((key) => delete newQueryData[key]);
    Object.assign(newQueryData, updatedKeys);
    return newQueryData;
  };

  const removeQueryData = (
    queryIndex: number,
    type: 'query' | 'formula',
    queriesLength: number,
  ) => {
    setQueryData((prev) => {
      const prevQueryData = { ...prev };
      const newQueryData = removeQueryDataAndRestructure(
        prevQueryData,
        queryIndex,
        queriesLength,
        type,
      );

      return newQueryData;
    });
  };

  return {
    callOnePromqlQuery,
    callSeriesQuery,
    getMetricsListRequest,
    labelValueList,
    labelsList,
    metricsList,
    promqlQueryRangeRequest,
    queryData,
    reloadMultipleQueries,
    reloadOneQuery,
    removeQueryData,
    seriesList,
    setMetricsList,
    setQueryData,
  };
};

export default useMetricsDataState;
