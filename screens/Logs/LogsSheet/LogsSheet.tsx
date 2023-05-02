import { Loader } from 'components';
import React from 'react';
import LogsSheetMain from './LogsSheetMain';
import LogsSheetToolbar from './LogsSheetToolbar';
import useSheetState from './useSheetState';

const LogsSheet = ({
  bindKeyHandlersRef,
  columns,
  columnsState,
  date,
  isLoading,
  logs,
  logsWorkbooksState,
  onClick,
  onEnter,
  onScrollEnd,
  setSelectedLog,
  sort,
  sortByColumn,
  tableOptions,
}) => {
  const sheetState = useSheetState();
  return (
    <div className="logs__table__logs">
      <LogsSheetToolbar
        columnsState={columnsState}
        date={date}
        logs={logs}
        logsWorkbooksState={logsWorkbooksState}
        sheetState={sheetState}
        tableOptions={tableOptions}
      />
      <Loader
        className="logs__table__logs__main"
        isLoading={isLoading}
        onClick={onClick}
      >
        <LogsSheetMain
          bindKeyHandlersRef={bindKeyHandlersRef}
          columns={columns}
          columnsState={columnsState}
          rows={logs}
          onEnter={onEnter}
          onScrollEnd={onScrollEnd}
          setSelectedLog={setSelectedLog}
          sheetState={sheetState}
          sortByColumn={sortByColumn}
          sort={sort}
          tableOptions={tableOptions}
        />
      </Loader>
    </div>
  );
};

export default LogsSheet;
