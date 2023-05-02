import { delimiter } from 'constants';
import { useForm, useRequest, useToggle } from 'hooks';
import React, { useEffect, useState } from 'react';
import { getFacetNames, getLogMetricsTimeSeries } from 'requests';
import { RangeAggregate, VectorAggregate, WidgetTypes } from 'types';
import {
  useLogsState,
  useQueryScheduler,
  useQuerySchedulerEffect,
} from './hooks';
import LogsActiveFacetHeader from './LogsActiveFacetHeader';
import LogsActiveFacetBody from './LogsActiveFacetBody';

type Props = {
  facetKey: string;
  getFacetNamesRequest: ReturnType<typeof useRequest>;
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
};

const LogsActiveFacet = ({
  facetKey,
  getFacetNamesRequest,
  logsState,
  queryScheduler,
}: Props) => {
  const form = useForm({
    filterOrExcludeByFingerprint: {},
    metricName: '',
    normalizeFunction: 'number',
    rangeAggregate: RangeAggregate.rate,
    rangeAggregateGrouping: [],
    vectorAggregate: VectorAggregate.sum,
    vectorAggregateGrouping: [],
    vectorAggregateParam: 10,
  });
  const getGroupingFacetNamesRequest = useRequest(getFacetNames);
  const getLogMetricsTimeSeriesRequest = useRequest(getLogMetricsTimeSeries);
  const [chartType, setChartType] = useState(WidgetTypes.Timeseries);
  const {
    date,
    filterOrExcludeByFingerprint,
    filterByFacets,
    keyExists,
    searchTerms,
    selectedFacetValues,
  } = logsState;
  const enableChartMetricButtonToggle = useToggle(true);

  const [component, name, type] = facetKey
    ? facetKey.split(delimiter)
    : ['', '', ''];

  const fetchFacetNames = () =>
    getFacetNamesRequest.call({
      date,
      filterOrExcludeByFingerprint,
      filterByFacets,
      keyExists,
      searchTerms,
      selectedFacetValues,
    });

  useQuerySchedulerEffect({
    cb: fetchFacetNames,
    logsState,
    queryScheduler,
    tab: 'chart',
  });

  return (
    <div className="logs__active-facet">
      <LogsActiveFacetHeader
        facetNames={getFacetNamesRequest.result || []}
        isFacetNamesLoading={getFacetNamesRequest.isLoading}
        getLogMetricsTimeSeriesRequest={getLogMetricsTimeSeriesRequest}
        logsState={logsState}
      />
      {component && name ? (
        <LogsActiveFacetBody
          chartType={chartType}
          component={component}
          enableChartMetricButtonToggle={enableChartMetricButtonToggle}
          facetKey={facetKey}
          facetNames={getFacetNamesRequest.result || []}
          form={form}
          getGroupingFacetNamesRequest={getGroupingFacetNamesRequest}
          getLogMetricsTimeSeriesRequest={getLogMetricsTimeSeriesRequest}
          key={facetKey}
          logsState={logsState}
          name={name}
          type={type}
        />
      ) : null}
    </div>
  );
};

export default LogsActiveFacet;
