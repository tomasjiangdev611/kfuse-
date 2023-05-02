import React, { ReactElement, useEffect, useMemo } from 'react';
import { useLogsTable, useQuerySchedulerEffect } from '../hooks';
import LogsSheet from '../LogsSheet';
import { tableColumns } from '../constants';
import { LogsTableProps } from '../types';

const LogsTable = ({
  clearHoveredLogDateUnix,
  columnsState,
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
  const logsTable = useLogsTable();
  const {
    appendLogs,
    cursor,
    generateNewId,
    id,
    isAppending,
    isLoading,
    logs,
    sort,
    sortByColumn,
  } = logsTable;

  const {
    clearSelectedLogFromContext,
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    selectedFacetValues,
    searchTerms,
  } = logsState;

  const fetchLogs = () => {
    generateNewId();
    return logsTable.fetchLogs({
      date,
      selectedFacetValues,
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      searchTerms,
      sort,
    });
  };

  const onScrollEnd = () => {
    appendLogs({
      date,
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      selectedFacetValues,
      searchTerms,
    });
  };

  useQuerySchedulerEffect({
    cb: fetchLogs,
    logsState,
    queryScheduler,
    sort,
    tab: 'logs',
  });

  const columns = useMemo(
    () => tableColumns(columnsState),
    [columnsState.state],
  );

  const onEnter = ({ selection }) => {
    const { initY, startY, endY } = selection;
    const y = initY > startY ? startY : endY;
    setSelectedLog({ index: Math.max(y, 0), logs: logs });
  };

  return (
    <LogsSheet
      bindKeyHandlersRef={bindKeyHandlersRef}
      columns={columns}
      columnsState={columnsState}
      date={date}
      key={id}
      isLoading={isLoading}
      logs={logs}
      logsWorkbooksState={logsWorkbooksState}
      onEnter={onEnter}
      onScrollEnd={onScrollEnd}
      setSelectedLog={setSelectedLog}
      sort={sort}
      sortByColumn={sortByColumn}
      tableOptions={tableOptions}
    />
  );
};

export default LogsTable;
