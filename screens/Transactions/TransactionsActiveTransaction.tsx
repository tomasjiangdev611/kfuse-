import React from 'react';
import TransactionsActiveTransactionChart from './TransactionsActiveTransactionChart';

const charts = [
  { key: 'avgDuration', label: 'Average Duration' },
  { key: 'totalTransactions', label: 'Total Transactions' },
  { key: 'totalFailedTransactions', label: 'Total Failed Transactions' },
];

const TransactionsActiveTransaction = ({ activeTransaction, date }) => {
  return (
    <div className="transactions__active-transaction">
      {charts.map((chart) => (
        <TransactionsActiveTransactionChart
          aggregate={chart.key}
          date={date}
          key={chart.key}
          label={chart.label}
          name={activeTransaction.name}
        />
      ))}
    </div>
  );
};

export default TransactionsActiveTransaction;
