import { useRequest } from 'hooks';
import React, { useEffect, useRef, useMemo, ReactElement } from 'react';
import { getLogStackedBarCountsUsingMetrics } from 'requests';

import { useLogsState, useQueryScheduler } from './hooks';
import LogsTimelineChart from './LogsTimelineChart';
import getTimeline from './getTimeline';
import useCompareTimeline from './useCompareTimeline';
import { getBucketSecs } from '../utils';

const LogsTimelineInner = ({
  hoveredLogDateUnix,
  logsState,
  queryScheduler,
  selectedLog,
  showTimelineToggle,
  width,
}: {
  hoveredLogDateUnix: number;
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
  selectedLog: any;
  showTimelineToggle: any;
  width: number;
}): ReactElement => {
  const compareTimeline = useCompareTimeline(logsState);
  const elementRef = useRef<HTMLDivElement>();
  const getLogStackedBarCountsUsingMetricsRequest = useRequest(
    getLogStackedBarCountsUsingMetrics,
  );

  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
    setDateZoomed,
  } = logsState;

  const { startTimeUnix, endTimeUnix } = date;

  useEffect(() => {
    if (width) {
      if (
        queryScheduler.secondQueryCompletedAt &&
        !queryScheduler.zoomHasBeenUpdated
      ) {
        const bucketSecs = getBucketSecs(date, width);
        getLogStackedBarCountsUsingMetricsRequest.call({
          bucketSecs,
          date,
          selectedFacetValues,
          filterByFacets,
          filterOrExcludeByFingerprint,
          keyExists,
          searchTerms,
        });

        compareTimeline.reset();
      }
    }
  }, [queryScheduler.secondQueryCompletedAt]);

  const logCounts = getLogStackedBarCountsUsingMetricsRequest.result || [];

  const timeline = useMemo(
    () => getTimeline(date, logCounts, selectedLog, width),
    [getLogStackedBarCountsUsingMetricsRequest.result, selectedLog],
  );

  return (
    <LogsTimelineChart
      compareTimeline={compareTimeline}
      date={date}
      elementRef={elementRef}
      isLoadingLogCounts={getLogStackedBarCountsUsingMetricsRequest.isLoading}
      setDateZoomed={setDateZoomed}
      showTimelineToggle={showTimelineToggle}
      timeline={timeline}
    />
  );
};

export default LogsTimelineInner;
