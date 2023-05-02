import React from 'react';
import LogsTransactionsTimelineBody from './LogsTransactionsTimelineBody';

const LogsTransactionsTimeline = ({ logsState, transactions }) => {
  const { state } = transactions;
  const paths = state?.pathStats || [];

  return (
    <div className="logs__transactions__timeline">
      <div className="logs__transactions__timeline_header">
        <div className="logs__transactions__timeline__header__info" />
      </div>
      <LogsTransactionsTimelineBody logsState={logsState} paths={paths} />
    </div>
  );
};

export default LogsTransactionsTimeline;
