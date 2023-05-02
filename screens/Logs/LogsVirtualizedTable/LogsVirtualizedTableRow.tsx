import classnames from 'classnames';
import React, { useLayoutEffect } from 'react';
import LogsTableRowSelectedLog from '../LogsTableRowSelectedLog';

const LogsVirtualizedTableRow = ({
  children,
  clearSelectedLogFromContext,
  columns,
  index,
  isLast,
  logsState,
  logsWorkbooksState,
  onScroll,
  row,
  selectedLog,
  selectedLogFromContext,
  setSelectedLog,
  style,
}) => {
  const isSelectedLogFromContext =
    selectedLogFromContext &&
    selectedLogFromContext.message === row.message &&
    selectedLogFromContext.timestamp === row.timestamp;

  const isSelectedLog = selectedLog && selectedLog === row;

  const onClick = () => {
    if (isSelectedLog) {
      setSelectedLog(null);
      clearSelectedLogFromContext();
    } else {
      setSelectedLog(row);
    }
  };

  useLayoutEffect(() => {
    if (isLast) {
      onScroll();
    }
  }, []);

  return (
    <div>
      <div
        className={classnames({
          'logs__virtualized-table__row': true,
          'logs__virtualized-table__row--active': isSelectedLog,
        })}
        onClick={onClick}
        style={style}
      >
        {children}
      </div>
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
    </div>
  );
};

export default LogsVirtualizedTableRow;
