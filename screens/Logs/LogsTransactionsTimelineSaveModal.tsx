import { arrayMoveImmutable } from 'array-move';
import { Input, useModalsContext, useToastmasterContext } from 'components';
import { useForm, useRequest } from 'hooks';
import React, { ReactElement, useState } from 'react';
import { X } from 'react-feather';
import { SortEndHandler } from 'react-sortable-hoc';
import { saveTransaction } from 'requests';
import { Scalars } from 'types';
import { useTransactionSelector } from './hooks';
import LogsTransactionsTimelineSaveModalFpHashes from './LogsTransactionsTimelineSaveModalFpHashes';

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'durationMetric', label: 'Duration Metric' },
  { key: 'failureMetric', label: 'Failure Metric' },
];

type SaveTransactionFormValues = {
  durationMetric: string;
  failureMetric: string;
  name: string;
};

type Props = {
  group: Scalars['Map'];
  transactionSelector: ReturnType<typeof useTransactionSelector>;
};

const LogsTransactionsTimelineSaveModal = ({
  group,
  transactionSelector,
}: Props): ReactElement => {
  const { propsByKey, values } = useForm<SaveTransactionFormValues>({
    durationMetric: '',
    failureMetric: '',
    name: '',
  });

  const [state, setState] = useState<string[]>(
    transactionSelector.selectedFpHashes,
  );

  const modals = useModalsContext();
  const saveTransactionRequest = useRequest(saveTransaction);
  const { addToast } = useToastmasterContext();

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    setState((prevState) => arrayMoveImmutable(prevState, oldIndex, newIndex));
  };

  const submit = () => {
    const onError = (error: Error) => {
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
      modals.pop();
    };

    saveTransactionRequest
      .call({ group, fpHashes: state, ...values })
      .then(onSuccess, onError);
  };

  return (
    <div className="modal modal--small">
      <div className="modal__header">
        <div className="modal__header__text">Save Transaction</div>
        <button className="modal__header__close" onClick={modals.pop}>
          <X />
        </button>
      </div>
      <div className="modal__body widget-modal__body">
        {fields.map((field) => (
          <div
            className="logs__transactions__save-transaction__item"
            key={field.key}
          >
            <div className="logs__transactions__save-transaction__item__label">
              {field.label}
            </div>
            <div className="logs__transactions__save-transaction__item__value">
              <Input
                type="text"
                {...propsByKey(field.key as keyof SaveTransactionFormValues)}
              />
            </div>
          </div>
        ))}
        <div className="logs__transactions__save-transaction__item">
          <div className="logs__transactions__save-transaction__item__label">
            Selected Fingerprints
          </div>
          <div className="logs__transactions__save-transaction__item__value">
            <LogsTransactionsTimelineSaveModalFpHashes
              fpHashes={state}
              onSortEnd={onSortEnd}
              helperClass="logs__transactions__save-transaction__sortable-list"
            />
          </div>
        </div>
      </div>
      <div className="modal__footer">
        <button className="modal__footer__button button" onClick={modals.pop}>
          Cancel
        </button>
        <button
          className="modal__footer__button button button--primary"
          onClick={submit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LogsTransactionsTimelineSaveModal;
