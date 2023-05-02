import React, { ReactElement, useEffect, useMemo } from 'react';
import { Loader, Table } from 'components';
import LogsSheet from '../LogsSheet';
import LogsTableRow from './LogsTableRow';
import LogsTableToolbar from './LogsTableToolbar';
import { tableColumns } from '../constants';
import { LogsTableProps } from '../types';

const LogsTableLiveLogs = ({
  bindKeyHandlersRef,
  clearHoveredLogDateUnix,
  columnsState,
  logsLiveTail,
  logsState,
  logsWorkbooksState,
  selectedLog,
  selectedLogFromContext,
  setHoveredLogDateUnix,
  setSelectedLog,
  tableOptions,
}: LogsTableProps): ReactElement => {
  const {
    date,
    filterOrExcludeByFingerprint,
    filterByFacets,
    keyExists,
    searchTerms,
    selectedFacetValues,
  } = logsState;

  const {
    hasStartedLiveTailToggle,
    id,
    isPlaying,
    liveTailLogs,
    pauseLiveTail,
    startLiveTailfNeeded,
    stopLiveTail,
  } = logsLiveTail;

  useEffect(() => {
    startLiveTailfNeeded({
      date,
      filterOrExcludeByFingerprint,
      filterByFacets,
      keyExists,
      searchTerms,
      selectedFacetValues,
    });
  }, [
    date,
    filterOrExcludeByFingerprint,
    filterByFacets,
    keyExists,
    searchTerms,
    selectedFacetValues,
  ]);

  const columns = useMemo(
    () => tableColumns(columnsState),
    [columnsState.state],
  );

  const onClick = () => {
    if (isPlaying) {
      pauseLiveTail();
    }
  };

  const onEnter = ({ selection }) => {
    const { initY, startY, endY } = selection;
    const y = initY > startY ? startY : endY;
    setSelectedLog({ index: y, logs: liveTailLogs });
  };

  useEffect(() => {
    return () => {
      stopLiveTail();
    };
  }, []);

  return (
    <LogsSheet
      bindKeyHandlersRef={bindKeyHandlersRef}
      columns={columns}
      columnsState={columnsState}
      date={date}
      key={id}
      logs={liveTailLogs}
      logsWorkbooksState={logsWorkbooksState}
      onClick={onClick}
      onEnter={onEnter}
      setSelectedLog={setSelectedLog}
      sort={{ sortBy: null, sortOrder: null }}
      tableOptions={tableOptions}
    />
  );
};

export default LogsTableLiveLogs;
