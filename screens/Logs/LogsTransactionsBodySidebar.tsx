import { Tab, Tabs, useTabs } from 'components';
import React from 'react';
import LogsTransactionsSaveTransaction from './LogsTransactionsSaveTransaction';
import LogsTransactionsStats from './LogsTransactionsStats';

const LogsTransactionsBodySidebar = ({ keys, form, transactions }) => {
  const tabs = useTabs();
  return (
    <div className="logs__transactions__sidebar">
      <Tabs tabs={tabs}>
        <Tab label="Stats">
          <LogsTransactionsStats transactions={transactions} />
        </Tab>
        <Tab label="Save Transaction">
          <LogsTransactionsSaveTransaction
            keys={keys}
            form={form}
            transactions={transactions}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default LogsTransactionsBodySidebar;
