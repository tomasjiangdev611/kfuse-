import React, { useMemo } from 'react';
import { Table } from 'react-fluid-table';
import LogsVirtualizedTableHeader from './LogsVirtualizedTableHeader';
import LogsVirtualizedTableRow from './LogsVirtualizedTableRow';
import LogsVirtualizedTableToolbar from './LogsVirtualizedTableToolbar';
import { tableColumns } from './tableColumns';

const LogsVirtualizedTable = ({
  clearSelectedLogFromContext,
  date,
  onScroll,
  rows,
  logsState,
  logsWorkbooksState,
  selectedColumns,
  selectedLog,
  selectedLogFromContext,
  setSelectedLog,
  sort,
  sortByColumn,
}) => {
  const columns = useMemo(
    () =>
      tableColumns(selectedColumns).map((column) => ({
        ...column,
        header: (props) => (
          <LogsVirtualizedTableHeader
            {...props}
            column={column}
            sort={sort}
            sortByColumn={sortByColumn}
          />
        ),
      })),
    [selectedColumns, sort],
  );

  const data = useMemo(
    () => [...rows],
    [rows, selectedLog, selectedLogFromContext],
  );

  return (
    <div className="logs__virtualized-table">
      <LogsVirtualizedTableToolbar
        date={date}
        logsWorkbooksState={logsWorkbooksState}
      />
      <Table
        columns={columns}
        data={data}
        rowRenderer={(props) => {
          return (
            <LogsVirtualizedTableRow
              {...props}
              clearSelectedLogFromContext={clearSelectedLogFromContext}
              columns={columns}
              isLast={props.index === data.length - 1}
              logsState={logsState}
              logsWorkbooksState={logsWorkbooksState}
              onScroll={onScroll}
              selectedLog={selectedLog}
              selectedLogFromContext={selectedLogFromContext}
              setSelectedLog={setSelectedLog}
            />
          );
        }}
      />
    </div>
  );
};

export default LogsVirtualizedTable;
