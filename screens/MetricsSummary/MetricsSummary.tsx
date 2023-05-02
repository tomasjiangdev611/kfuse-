import { Loader } from 'components';
import { Datepicker } from 'composite';
import React, { ReactElement, useEffect } from 'react';

import MetricsSummaryTags from './MetricsSummaryTags';
import MetricsSummaryMetadata from './MetricsSummaryMetadata';
import MetricsSummaryNames from './MetricsSummaryNames';
import useMetricsSummary from './useMetricsSummary';
import { groupMetricSeries } from './utils';

const MetricsSummary = (): ReactElement => {
  const metricSummaryState = useMetricsSummary();
  const {
    absoluteTimeRangeStorage,
    date,
    getMetricsListRequest,
    promqlMetadataRequest,
    promqlSeriesRequest,
    onDateChange,
    selectedMetric,
    setMetricSeries,
  } = metricSummaryState;

  useEffect(() => {
    if (selectedMetric) {
      promqlSeriesRequest
        .call({ date, metric: selectedMetric.name })
        .then((seriesResponse: any) => {
          if (seriesResponse.data) {
            const metricSeries = groupMetricSeries(seriesResponse.data);
            setMetricSeries(metricSeries);
          }
        });
    }
  }, [selectedMetric, date]);

  return (
    <div className="metrics-summary">
      <Loader
        isLoading={
          getMetricsListRequest.isLoading || promqlMetadataRequest.isLoading
        }
      >
        <div className="metrics-summary__header">
          <div className="metrics-summary__header__title">Metric Summary</div>
          <div className="metrics-summary__header__date-picker">
            <Datepicker
              absoluteTimeRangeStorage={absoluteTimeRangeStorage}
              className="logs__search__datepicker"
              hasStartedLiveTail={false}
              onChange={onDateChange}
              startLiveTail={null}
              value={date}
            />
          </div>
        </div>

        <div className="metrics-summary__body">
          <MetricsSummaryNames metricSummaryState={metricSummaryState} />
          <div className="metrics-summary__body__details">
            <div className="metrics-summary__body__title">METRICS DETAILS</div>
            {selectedMetric && (
              <Loader isLoading={promqlSeriesRequest.isLoading}>
                <MetricsSummaryMetadata
                  metricSummaryState={metricSummaryState}
                />
                <MetricsSummaryTags metricSummaryState={metricSummaryState} />
              </Loader>
            )}
          </div>
        </div>
      </Loader>
    </div>
  );
};

export default MetricsSummary;
