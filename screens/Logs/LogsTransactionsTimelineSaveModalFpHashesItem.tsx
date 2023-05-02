import React from 'react';
import { AlignJustify } from 'react-feather';
import { SortableElement } from 'react-sortable-hoc';

type Props = {
  fpHash: string;
};

const LogsTransactionsTimelineSaveModalFpHashesItem = ({ fpHash }: Props) => {
  return (
    <div className="logs__transactions__save-transaction__fp-hashes__item">
      <AlignJustify className="logs__transactions__save-transaction__fp-hashes__item__icon" size={11} />
      {fpHash}
    </div>
  );
};

export default SortableElement(LogsTransactionsTimelineSaveModalFpHashesItem);
