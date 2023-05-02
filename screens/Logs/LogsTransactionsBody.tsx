import React from 'react';
import { useLogsState, useTransactions } from './hooks';
import LogsTransactionsTimeline from './LogsTransactionsTimeline';

type Props = {
  logsState: ReturnType<typeof useLogsState>;
  transactions: ReturnType<typeof useTransactions>;
};

const LogsTransactionsBody = ({ logsState, transactions }: Props) => {
  return (
    <div className="logs__transactions__facet__body">
      <LogsTransactionsTimeline
        logsState={logsState}
        transactions={transactions}
      />
    </div>
  );
};

export default LogsTransactionsBody;
