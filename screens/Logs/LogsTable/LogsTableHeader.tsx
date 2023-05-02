import { TableColumn } from 'components';
import React, { ReactElement } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { LogEvent } from 'types';

type Props = {
  column: TableColumn<LogEvent>;
  sort: any;
  sortByColumn: any;
};

const LogsTableHeader = ({
  column,
  sort,
  sortByColumn,
}: Props): ReactElement => {
  const { sortBy, sortOrder } = sort;

  const onClick = () => {
    sortByColumn(column.key);
  };

  return (
    <div className="logs__table__header__inner">
      <button className="logs__table__header__label" onClick={onClick}>
        {column.label}
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

export default LogsTableHeader;
