import { Input } from 'components';
import React, { ReactElement } from 'react';
import { DateSelection, RequestResult } from 'types';

import { useAlertsCreateLogs } from '../hooks';

const AlertsCreateLogsLogQL = ({
  baseWidth,
  alertsCreateLogsState,
  date,
  logMetricsTimeSeriesLogQLRequest,
}: {
  baseWidth: number;
  alertsCreateLogsState: ReturnType<typeof useAlertsCreateLogs>;
  date: DateSelection;
  logMetricsTimeSeriesLogQLRequest: RequestResult;
}): ReactElement => {
  const { logQLText, setLogQLText } = alertsCreateLogsState;

  const runQuery = () => {
    logMetricsTimeSeriesLogQLRequest.call({
      date,
      logQL: logQLText,
      width: baseWidth - 160,
    });
  };
  return (
    <div className="alerts__create__logs__logql">
      <Input
        onChange={(val) => setLogQLText(val)}
        placeholder="Enter logql query"
        type="text"
        value={logQLText}
      />
      <div className="alerts__create__logs__logql__run-query">
        <button className="button button--blue" onClick={runQuery}>
          Run Query
        </button>
      </div>
    </div>
  );
};

export default AlertsCreateLogsLogQL;
