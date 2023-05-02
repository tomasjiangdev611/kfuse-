import { TableColumn } from 'components';
import React, { ReactElement } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { LogEvent } from 'types';

type Props = {
  column: TableColumn<LogEvent>;
  sort: any;
  sortByColumn: any;
  style: Object;
};

const LogsVirtualizedTableHeader = ({ column, sort, sortByColumn, style }: Props): ReactElement => {
  const { sortBy, sortOrder } = sort;

  const onClick = () => {
    sortByColumn(column.key);
  };

  return (
    <div className="logs__table__header__inner"  style={{ ...style, padding: '16px 8px' }}>
      <button className="logs__table__header__label" onClick={onClick}>
        {column.header}
      </button>
      {sortBy === column.key ? (
        <div className="logs__table__header__chevron">
          {sortOrder === 'Asc' ? (
            <ChevronUp size={11} />
          ) : (
            <ChevronDown size={11} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default LogsVirtualizedTableHeader;
