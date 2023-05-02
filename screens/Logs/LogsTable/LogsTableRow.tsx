import { TableRow, TableRowProps } from 'components';
import React, { ReactElement } from 'react';
import { LogEvent } from 'types';
import { useLogsState, useLogsWorkbooksState } from '../hooks';
import LogsTableRowSelectedLog from './LogsTableRowSelectedLog';

type Props = TableRowProps<LogEvent> & {
  logsState: ReturnType<typeof useLogsState>;
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  selectedLog?: LogEvent;
  selectedLogFromContext?: LogEvent;
  setSelectedLog: (logEvent: LogEvent) => void;
};

const LogsTableRow = ({
  className,
  columns,
  isFullWidth,
  logsState,
  logsWorkbooksState,
  onMouseEnter,
  onRowClickHandler,
  row,
  selectedLog,
  selectedLogFromContext,
  setSelectedLog,
  shouldRenderDiv,
  totalWidth,
  widths,
  ...rest
}: Props): ReactElement => {
  const isSelectedLogFromContext =
    selectedLogFromContext &&
    selectedLogFromContext.message === row.message &&
    selectedLogFromContext.timestamp === row.timestamp;

  const isSelectedLog = selectedLog && selectedLog === row;

  return (
    <>
      <TableRow
        {...rest}
        className={className}
        columns={columns}
        isFullWidth={isFullWidth}
        onMouseEnter={onMouseEnter}
        onRowClickHandler={onRowClickHandler}
        row={row}
        shouldRenderDiv={shouldRenderDiv}
        totalWidth={totalWidth}
        widths={widths}
      />
      {isSelectedLog || isSelectedLogFromContext ? (
        <LogsTableRowSelectedLog
          columns={columns}
          isSelectedLogFromContext={isSelectedLogFromContext}
          logsState={logsState}
          logsWorkbooksState={logsWorkbooksState}
          selectedLog={row}
          setSelectedLog={setSelectedLog}
        />
      ) : null}
    </>
  );
};

export default LogsTableRow;
