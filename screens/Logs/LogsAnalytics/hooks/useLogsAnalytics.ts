import { useLogsMetricsQueryBuilderState, useRequest } from 'hooks';
import { useState } from 'react';
import {
  deleteLogsMetric,
  getLogsSavedMetrics,
  getLogMetricsTimeseriesMultiple,
  getLogMetricsTimeSeriesLogQL,
  saveLogsMetrics,
} from 'requests';
import { LogsMetricQueryProps } from 'types';
import { getLabelAndFacetWithDelimiter } from 'utils/MetricsLogsQueryBuilder';

import { useLogsState } from '../../hooks';

const useLogsAnalytics = (logsState: ReturnType<typeof useLogsState>) => {
  const [logsMetricsExplorerType, setLogsMetricsExplorerType] =
    useState('builder');
  const [logqlText, setLogqlText] = useState<string>('');
  const [chartWidth, setChartWidth] = useState(800);

  const deleteLogsMetricRequest = useRequest(deleteLogsMetric);
  const saveLogsMetricsRequest = useRequest(saveLogsMetrics);
  const savedMetricsRequest = useRequest(getLogsSavedMetrics);
  const getLogMetricsTimeseriesRequest = useRequest(
    getLogMetricsTimeseriesMultiple,
  );
  const getLogMetricsTimeSeriesLogQLRequest = useRequest(
    getLogMetricsTimeSeriesLogQL,
  );

  const logsMetricsQueryBuilderState = useLogsMetricsQueryBuilderState(
    logsState.date,
  );
  const { queries } = logsMetricsQueryBuilderState;
  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
    width,
  } = logsState;

  const generateBuilderChart = async () => {
    const newQueries = queries.map((query: LogsMetricQueryProps) => ({
      ...query,
      rangeAggregateGrouping: getLabelAndFacetWithDelimiter(
        query.rangeAggregateGrouping,
      ),
      vectorAggregate:
        query.vectorAggregate === 'none' ? '' : query.vectorAggregate,
      vectorAggregateGrouping: getLabelAndFacetWithDelimiter(
        query.vectorAggregateGrouping,
      ),
    }));

    getLogMetricsTimeseriesRequest.call({
      date,
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      queries: newQueries,
      searchTerms,
      selectedFacetValues,
      width,
    });
  };

  const generateLogQLChart = async () => {
    getLogMetricsTimeSeriesLogQLRequest.call({
      date,
      logQL: logqlText,
      width: chartWidth,
    });
  };

  return {
    chartWidth,
    deleteLogsMetricRequest,
    generateBuilderChart,
    generateLogQLChart,
    getLogMetricsTimeseriesRequest,
    getLogMetricsTimeSeriesLogQLRequest,
    logsMetricsQueryBuilderState,
    logsMetricsExplorerType,
    logqlText,
    saveLogsMetricsRequest,
    savedMetricsRequest,
    setChartWidth,
    setLogsMetricsExplorerType,
    setLogqlText,
  };
};

export default useLogsAnalytics;
