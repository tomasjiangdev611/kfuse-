import React from 'react';
import TableHeaderSortable from './TableHeaderSortable';

const defaultRenderHeader = ({
  column,
  externalTableSort,
  isSortingEnabled,
  tableSort,
}) => {
  if (isSortingEnabled) {
    return (
      <TableHeaderSortable
        column={column}
        externalTableSort={externalTableSort}
        tableSort={tableSort}
      />
    );
  }

  return column.label;
};

export default defaultRenderHeader;
