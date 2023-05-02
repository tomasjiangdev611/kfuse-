import React, { ReactElement } from 'react';
import LogsTableLiveLogs from './LogsTableLiveLogs';
import LogsTableLogs from './LogsTableLogs';
import { LogsTableProps } from '../types';

const LogsTable = ({
  clearHoveredLogDateUnix,
  columnsState,
  logsLiveTail,
  logsState,
  logsWorkbooksState,
  queryScheduler,
  selectedLog,
  selectedLogFromContext,
  setHoveredLogDateUnix,
  setSelectedLog,
  bindKeyHandlersRef,
  tableOptions,
}: LogsTableProps): ReactElement => {
  const { logs } = logsState;
  const { isEnabled } = logsLiveTail;

  return isEnabled ? (
    <LogsTableLiveLogs
      bindKeyHandlersRef={bindKeyHandlersRef}
      clearHoveredLogDateUnix={clearHoveredLogDateUnix}
      columnsState={columnsState}
      logsLiveTail={logsLiveTail}
      logsState={logsState}
      logsWorkbooksState={logsWorkbooksState}
      selectedLog={selectedLog}
      setHoveredLogDateUnix={setHoveredLogDateUnix}
      setSelectedLog={setSelectedLog}
      tableOptions={tableOptions}
    />
  ) : (
    <LogsTableLogs
      bindKeyHandlersRef={bindKeyHandlersRef}
      clearHoveredLogDateUnix={clearHoveredLogDateUnix}
      columnsState={columnsState}
      logs={logs}
      logsState={logsState}
      logsWorkbooksState={logsWorkbooksState}
      queryScheduler={queryScheduler}
      selectedLog={selectedLog}
      selectedLogFromContext={selectedLogFromContext}
      setHoveredLogDateUnix={setHoveredLogDateUnix}
      setSelectedLog={setSelectedLog}
      tableOptions={tableOptions}
    />
  );
};

export default LogsTable;
