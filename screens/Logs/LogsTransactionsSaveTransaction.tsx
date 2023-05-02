import { Input, useToastmasterContext } from 'components';
import { useForm, useRequest } from 'hooks';
import React from 'react';
import { saveTransaction } from 'requests';

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'durationMetric', label: 'Duration Metric' },
  { key: 'failureMetric', label: 'Failure Metric' },
];

const LogsTransactionsSaveTransaction = ({ form, keys, transactions }) => {
  const { propsByKey, values } = form;
  const { start, end } = transactions.state;
  const saveTransactionRequest = useRequest(saveTransaction);
  const { addToast } = useToastmasterContext();

  const onClick = () => {
    const onError = (error) => {
      addToast({
        status: 'error',
        text: `Failed to save transaction: ${JSON.stringify(error)}`,
      });
    };

    const onSuccess = () => {
      addToast({
        status: 'success',
        text: `Transaction "${values.name}" saved successfully`,
      });
      clear();
      transactions.clearStartAndEnd();
    };

    saveTransactionRequest
      .call({ keys, start, end, ...values })
      .then(onSuccess, onError);
  };

  return (
    <div className="logs__transactions__save-transaction">
      <div className="logs__transactions__save-transaction__body">
        {start ? (
          <div className="logs__transactions__save-transaction__item">
            <div className="logs__transactions__save-transaction__item__label">
              Start Pattern
            </div>
            <div className="logs__transactions__save-transaction__item__value">
              {start}
            </div>
          </div>
        ) : null}
        {end ? (
          <div className="logs__transactions__save-transaction__item">
            <div className="logs__transactions__save-transaction__item__label">
              End Pattern
            </div>
            <div className="logs__transactions__save-transaction__item__value">
              {end}
            </div>
          </div>
        ) : null}
        {fields.map((field) => (
          <div
            className="logs__transactions__save-transaction__item"
            key={field.key}
          >
            <div className="logs__transactions__save-transaction__item__label">
              {field.label}
            </div>
            <div className="logs__transactions__save-transaction__item__value">
              <Input type="text" {...propsByKey(field.key)} />
            </div>
          </div>
        ))}
      </div>
      {start && end ? (
        <div className="logs__transactions__save-transaction__footer">
          <button className="button button--primary" onClick={onClick}>
            Save Transaction
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default LogsTransactionsSaveTransaction;
