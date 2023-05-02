import classnames from 'classnames';
import React from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { TableColumn } from './types';
import useTableSort from './useTableSort';

type Props = {
  externalTableSort?: ReturnType<typeof useTableSort>;
  column: TableColumn<any>;
  tableSort: ReturnType<typeof useTableSort>;
};

const TableHeaderSortable = ({
  column,
  externalTableSort,
  tableSort,
}: Props) => {
  const onClick = () => {
    if (externalTableSort) {
      externalTableSort.onSort(column.key);
    } else {
      tableSort.onSort(column.key);
    }
  };

  const asc = externalTableSort ? externalTableSort.asc : tableSort.asc;
  const key = externalTableSort ? externalTableSort.key : tableSort.key;
  const isSorted = column.key === key;
  return (
    <div
      className={classnames({
        'table__header-sortable': true,
        'table__header-sortable--sorted': isSorted,
      })}
      onClick={onClick}
    >
      <div className="table__header-sortable__label">{column.label}</div>
      {isSorted ? (
        <div className="table__header-sortable__icon">
          {asc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      ) : (
        <div className="table__header-sortable__icon" />
      )}
    </div>
  );
};

export default TableHeaderSortable;
