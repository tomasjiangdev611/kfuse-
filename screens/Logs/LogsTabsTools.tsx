import { PopoverTrigger, TableColumn } from 'components';
import React, { ReactElement } from 'react';
import { Settings } from 'react-feather';
import { LogEvent } from 'types';
import { useTableOptions } from './hooks';
import LogsTabsToolsColumnsPanel from './LogsTabsToolsColumnsPanel';

type Props = {
  selectedColumns: TableColumn<LogEvent>[];
  setSelectedColumns: (columns: TableColumn<LogEvent>[]) => void;
  tab: string;
  tableOptions: ReturnType<typeof useTableOptions>;
};

const LogsTabsTools = ({
  selectedColumns,
  setSelectedColumns,
  tab,
  tableOptions,
}: Props): ReactElement => {
  if (tab === undefined) {
    return (
      <div className="logs__tabs__tools">
        <PopoverTrigger
          className="logs__tabs__tools__item"
          component={LogsTabsToolsColumnsPanel}
          props={{ selectedColumns, setSelectedColumns, tableOptions }}
          right
        >
          <Settings />
        </PopoverTrigger>
      </div>
    );
  }
  return <div />;
};

export default LogsTabsTools;
