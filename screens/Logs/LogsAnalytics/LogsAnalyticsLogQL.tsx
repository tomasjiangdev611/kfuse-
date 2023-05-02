import { Input } from 'components';
import React, { ReactElement } from 'react';

import { useLogsAnalytics } from './hooks';

const LogsAnalyticsLogQL = ({
  logsAnalytics,
}: {
  logsAnalytics: ReturnType<typeof useLogsAnalytics>;
}): ReactElement => {
  const { logqlText, setLogqlText } = logsAnalytics;
  return (
    <div className="logs__analytics__logql">
      <Input
        onChange={(val) => setLogqlText(val)}
        placeholder="Enter logql query"
        type="text"
        value={logqlText}
      />
    </div>
  );
};

export default LogsAnalyticsLogQL;
