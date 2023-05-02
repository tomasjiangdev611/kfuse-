import { Datepicker } from 'composite';
import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { useEffect, useState } from 'react';
import { listTransactions } from 'requests';
import TransactionsActiveTransaction from './TransactionsActiveTransaction';
import TransactionsItem from './TransactionsItem';

const endTimeUnix = dayjs().unix();
const startTimeUnix = dayjs()
  .subtract(60 * 5, 'seconds')
  .unix();
const preset = 60 * 5;

const Transactions = () => {
  const [date, setDate] = useState({
    preset,
    endTimeUnix,
    startTimeUnix,
  });

  const listTransactionsRequest = useRequest(listTransactions);
  const [activeTransaction, setActiveTransaction] = useState(null);

  useEffect(() => {
    listTransactionsRequest.call();
  }, []);

  return (
    <div className="transactions">
      <div className="transactions__main">
        <div className="transactions__header">
          <Datepicker
            className="transactions__header__datepicker"
            onChange={setDate}
            value={date}
          />
        </div>
        <div className="transactions__items">
          {(listTransactionsRequest.result || []).map((transaction) => (
            <TransactionsItem
              date={date}
              isActive={transaction === activeTransaction}
              key={transaction.key}
              setActiveTransaction={setActiveTransaction}
              transaction={transaction}
            />
          ))}
        </div>
      </div>
      {activeTransaction ? (
        <TransactionsActiveTransaction
          activeTransaction={activeTransaction}
          date={date}
          key={activeTransaction?.name}
        />
      ) : null}
    </div>
  );
};

export default Transactions;
