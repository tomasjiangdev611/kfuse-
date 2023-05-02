import React from 'react';
import { SortableContainer, SortEndHandler } from 'react-sortable-hoc';
import LogsTransactionsTimelineSaveModalFpHashesItem from './LogsTransactionsTimelineSaveModalFpHashesItem';

type Props = {
  fpHashes: string[];
  onSortEnd: SortEndHandler;
};

const LogsTransactionsTimelineSaveModalFpHashes = ({ fpHashes }: Props) => {
  return (
    <div className="logs__transactions__save-transaction__fp-hashes">
      {fpHashes.map((fpHash, index) => (
        <LogsTransactionsTimelineSaveModalFpHashesItem
          fpHash={fpHash}
          key={`item-${fpHash}`}
          index={index}
        />
      ))}
    </div>
  );
};

export default SortableContainer(LogsTransactionsTimelineSaveModalFpHashes);
