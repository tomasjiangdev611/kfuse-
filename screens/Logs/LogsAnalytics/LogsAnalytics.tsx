import { AutocompleteV2 } from 'components';
import React, { ReactElement } from 'react';

import {
  useLogsState,
  useQueryScheduler,
  useQuerySchedulerEffect,
} from '../hooks';
import { useLogsAnalytics } from './hooks';
import LogsAnalyticsQueryBuilder from './LogsAnalyticsQueryBuilder';
import LogsAnalyticsChart from './LogsAnalyticsChart';
import LogsAnalyticsLogQL from './LogsAnalyticsLogQL';
import LogsAnalyticsSavedMetrics from './LogsAnalyticsSavedMetrics';

const LogsAnalytics = ({
  queryScheduler,
  logsState,
}: {
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
}): ReactElement => {
  const logsAnalytics = useLogsAnalytics(logsState);
  const {
    generateBuilderChart,
    generateLogQLChart,
    logsMetricsExplorerType,
    logsMetricsQueryBuilderState,
    setLogsMetricsExplorerType,
  } = logsAnalytics;

  useQuerySchedulerEffect({
    cb: () => Promise.resolve(),
    logsState,
    queryScheduler,
    tab: 'analytics',
  });

  return (
    <div className="logs__analytics">
      <div className="logs__analytics__header">
        <AutocompleteV2
          onChange={(val) => setLogsMetricsExplorerType(val)}
          options={[
            { label: 'Builder', value: 'builder' },
            { label: 'LogQL', value: 'logql' },
          ]}
          value={logsMetricsExplorerType}
        />
        <div>
          <button
            className="button button--primary"
            onClick={() => {
              if (logsMetricsExplorerType === 'builder') {
                generateBuilderChart();
              } else if (logsMetricsExplorerType === 'logql') {
                generateLogQLChart();
              }
            }}
          >
            Generate Chart
          </button>
        </div>
      </div>
      {logsMetricsExplorerType === 'builder' && (
        <LogsAnalyticsQueryBuilder
          logsMetricsQueryBuilderState={logsMetricsQueryBuilderState}
          logsState={logsState}
        />
      )}
      {logsMetricsExplorerType === 'logql' && (
        <LogsAnalyticsLogQL logsAnalytics={logsAnalytics} />
      )}
      <LogsAnalyticsChart
        logsAnalytics={logsAnalytics}
        logsMetricsQueryBuilderState={logsMetricsQueryBuilderState}
        logsState={logsState}
      />
      <LogsAnalyticsSavedMetrics logsAnalytics={logsAnalytics} />
    </div>
  );
};

export default LogsAnalytics;
