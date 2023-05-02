import { TableColumn, usePopoverContext } from 'components';
import React, { FunctionComponent, ReactElement } from 'react';
import { LogEvent } from 'types';
import { ArrowDown, ArrowUp } from 'react-feather';

import { useLogsState } from '../hooks';

type Props = {
  column: TableColumn<LogEvent>;
  logsState: ReturnType<typeof useLogsState>;
};

const LogsTableHeaderPanel: FunctionComponent<Props> = ({
  column,
  logsState,
}: Props): ReactElement => {
  const { sortByColumn } = logsState;
  const { close } = usePopoverContext();

  const sortAscending = () => {
    sortByColumn(column.key);
    close();
  };

  const sortDescending = () => {
    sortByColumn(column.key);
    close();
  };

  return (
    <div className="logs__table__header__panel">
      <button className="popover__panel__item" onClick={sortAscending}>
        <ArrowUp className="popover__panel__item__icon" size={11} />
        <span>Sort Ascending</span>
      </button>
      <button className="popover__panel__item" onClick={sortDescending}>
        <ArrowDown className="popover__panel__item__icon" size={11} />
        <span>Sort Descending</span>
      </button>
    </div>
  );
};

export default LogsTableHeaderPanel;
