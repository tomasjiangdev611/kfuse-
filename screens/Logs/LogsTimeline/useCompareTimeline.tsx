import dayjs from 'dayjs';
import { useRequest, useToggle } from 'hooks';
import { useMemo } from 'react';
import { getLogStackedBarCountsUsingMetrics } from 'requests';
import { DateSelection } from 'types';
import getTimeline from './getTimeline';
import { getBucketSecs } from '../utils';

const getCompareUnit = (date: DateSelection) => {
  const { startTimeUnix, endTimeUnix } = date;
  const diff = endTimeUnix - startTimeUnix;

  if (diff > 60 * 60 * 24 * 365) {
    return null;
  }

  if (diff > 60 * 60 * 24 * 30) {
    return 'year';
  }

  if (diff > 60 * 60 * 24 * 7) {
    return 'month';
  }

  if (diff > 60 * 60 * 24) {
    return 'week';
  }

  return 'day';
};

const useCompareTimeline = (logsState: any) => {
  const getLogStackedBarCountsUsingMetricsRequest = useRequest(
    getLogStackedBarCountsUsingMetrics,
  );
  const isEnabledToggle = useToggle();

  const {
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
    width,
  } = logsState;

  const unit = getCompareUnit(logsState.date);

  const startTimeUnix = dayjs
    .unix(logsState.date.startTimeUnix)
    .subtract(1, unit)
    .unix();
  const endTimeUnix = dayjs
    .unix(logsState.date.endTimeUnix)
    .subtract(1, unit)
    .unix();

  const date = {
    ...logsState.date,
    startTimeUnix,
    endTimeUnix,
  };

  const fetchIfNeeded = () => {
    if (!getLogStackedBarCountsUsingMetricsRequest.calledAtLeastOnce) {
      const bucketSecs = getBucketSecs(date, width);

      getLogStackedBarCountsUsingMetricsRequest.call({
        bucketSecs,
        date,
        filterByFacets,
        filterOrExcludeByFingerprint,
        keyExists,
        searchTerms,
        selectedFacetValues,
      });
    }
  };

  const logCounts = getLogStackedBarCountsUsingMetricsRequest.result || [];

  const compareTimeline = useMemo(
    () => getTimeline(date, logCounts, null, width),
    [getLogStackedBarCountsUsingMetricsRequest.result, width],
  );

  const reset = () => {
    getLogStackedBarCountsUsingMetricsRequest.clear();
    isEnabledToggle.off();
  };

  const toggle = () => {
    if (!isEnabledToggle.value) {
      fetchIfNeeded();
    }

    isEnabledToggle.toggle();
  };

  return {
    compareTimeline,
    enabled: isEnabledToggle.value,
    reset,
    toggle,
  };
};

export default useCompareTimeline;
