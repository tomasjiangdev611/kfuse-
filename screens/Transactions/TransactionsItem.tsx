import classnames from 'classnames';
import React from 'react';
import TransactionsItemChart from './TransactionsItemChart';

const charts = [
  { key: 'avgDuration', label: 'Average Duration' },
  { key: 'totalTransactions', label: 'Total Transactions' },
  { key: 'totalFailedTransactions', label: 'Total Failed Transactions' },
];

const TransactionsItem = ({ date, isActive, setActiveTransaction, transaction }) => {
  const onClick = () => {
    setActiveTransaction(transaction);
  };

  return (
    <div
      className={classnames({
        transactions__item: true,
        ['transactions__item--active']: isActive,
      })}
      onClick={onClick}
    >
      <div className="transactions__item__header">{transaction.name}</div>
      <div className="transactions__item__charts">
        {charts.map((chart) => (
          <TransactionsItemChart
            aggregate={chart.key}
            date={date}
            key={chart.key}
            label={chart.label}
            name={transaction.name}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionsItem;
