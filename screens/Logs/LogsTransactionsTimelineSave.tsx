import classnames from 'classnames';
import { useModalsContext } from 'components';
import React from 'react';
import { Scalars } from 'types';
import { useTransactionSelector } from './hooks';
import LogsTransactionsTimelineSaveModal from './LogsTransactionsTimelineSaveModal';

type Props = {
  group: Scalars['Map'];
  transactionSelector: ReturnType<typeof useTransactionSelector>;
};

const LogsTransactionsTimelineSave = ({
  group,
  transactionSelector,
}: Props) => {
  const { selectedFpHashes } = transactionSelector;
  const modals = useModalsContext();

  const openModal = () => {
    modals.push(
      <LogsTransactionsTimelineSaveModal
        group={group}
        transactionSelector={transactionSelector}
      />,
    );
  };

  return (
    <div className="logs__transactions__timeline__save">
      <div className="logs__transactions__timeline__save__left">
        <div className="logs__transactions__timeline__save__header">
          {`${selectedFpHashes.length} Fingerprint${
            selectedFpHashes.length === 1 ? '' : 's'
          } Selected`}
        </div>
        {selectedFpHashes.length === 1 ? (
          <div className="logs__transactions__timeline__save__info__item">
            Select at least 2 fingerprints to save a transaction
          </div>
        ) : null}
      </div>
      <div className="logs__transactions__timeline__save__right">
        <button
          className={classnames({
            button: true,
            'button--primary': true,
            'button--disabled': selectedFpHashes.length === 1,
          })}
          onClick={openModal}
        >
          Save Transaction
        </button>
      </div>
    </div>
  );
};

export default LogsTransactionsTimelineSave;
