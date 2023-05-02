import { ChartRenderer, TooltipTrigger, useModalsContext } from 'components';
import { useLogsMetricsQueryBuilderState } from 'hooks';
import ResizeObserver from 'rc-resize-observer';
import React, { ReactElement } from 'react';
import { MdSave } from 'react-icons/md';
import { BiExport } from 'react-icons/bi';

import { useLogsState } from '../hooks';
import { useLogsAnalytics } from './hooks';
import LogsAnalyticsSaveMetrics from './LogsAnalyticsSaveMetrics';
import LogsAnalyticsExportDashboard from './LogsAnalyticsExportDashboard';

const LogsAnalyticsChartSaveToolbar = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return (
    <div className="new-metrics__chart__right-toolbar__icon" onClick={onClick}>
      <TooltipTrigger tooltip="Save Metric">
        <MdSave />
      </TooltipTrigger>
    </div>
  );
};

const LogsAnalyticsChartExportToolbar = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return (
    <div className="new-metrics__chart__right-toolbar__icon" onClick={onClick}>
      <TooltipTrigger tooltip="Export">
        <BiExport />
      </TooltipTrigger>
    </div>
  );
};

const LogsAnalyticsChart = ({
  logsAnalytics,
  logsMetricsQueryBuilderState,
  logsState,
}: {
  logsAnalytics: ReturnType<typeof useLogsAnalytics>;
  logsMetricsQueryBuilderState: ReturnType<
    typeof useLogsMetricsQueryBuilderState
  >;
  logsState: ReturnType<typeof useLogsState>;
}): ReactElement => {
  const modal = useModalsContext();
  const { queries } = logsMetricsQueryBuilderState;
  const {
    chartWidth,
    getLogMetricsTimeseriesRequest,
    getLogMetricsTimeSeriesLogQLRequest,
    logsMetricsExplorerType,
    logqlText,
    setChartWidth,
  } = logsAnalytics;

  const normalizeFunction = queries.reduce((acc, query) => {
    if (acc === null) {
      return query.normalizeFunction;
    }
    if (acc !== query.normalizeFunction) {
      return 'number';
    }
    return acc;
  }, null);

  const openSaveMetricModal = () => {
    modal.push(
      <LogsAnalyticsSaveMetrics
        closeModal={modal.pop}
        logsAnalytics={logsAnalytics}
        logsState={logsState}
        queries={queries}
      />,
    );
  };

  const openExportToDashboardModal = () => {
    modal.push(
      <LogsAnalyticsExportDashboard
        closeModal={modal.pop}
        date={logsState.date}
        expr={logqlText}
      />,
    );
  };

  const chartData =
    logsMetricsExplorerType === 'logql'
      ? getLogMetricsTimeSeriesLogQLRequest.result
      : getLogMetricsTimeseriesRequest.result;
  const firstQueryVector = queries[0]?.vectorAggregate;

  return (
    <ResizeObserver onResize={(e) => setChartWidth(e.width)}>
      <ChartRenderer
        chartData={chartData || { data: [], series: [] }}
        date={logsState.date}
        isLoading={
          getLogMetricsTimeseriesRequest.isLoading ||
          getLogMetricsTimeSeriesLogQLRequest.isLoading
        }
        legend={{ legendType: 'values' }}
        size={{ width: chartWidth, height: 280 }}
        strokeType={chartData?.data[0].length < 5 ? 'none' : 'normal'}
        toolbar={{
          rightToolbar:
            logsMetricsExplorerType === 'builder' ? (
              <>
                {firstQueryVector === 'none' && (
                  <LogsAnalyticsChartSaveToolbar
                    onClick={openSaveMetricModal}
                  />
                )}
              </>
            ) : (
              <LogsAnalyticsChartExportToolbar
                onClick={openExportToDashboardModal}
              />
            ),
          toolbarMenuType: 'dropdown',
        }}
        unit={normalizeFunction === 'duration' ? 's' : normalizeFunction}
      />
    </ResizeObserver>
  );
};

export default LogsAnalyticsChart;
