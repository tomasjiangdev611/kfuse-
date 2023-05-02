import { Sheet } from 'components';
import { lockedColumns } from 'components/Sheet/sheetUtils';
import React from 'react';
import LogsSheetTooltip from './LogsSheetTooltip';

const LogsSheetWithDimensions = ({
  bindKeyHandlersRef,
  columns,
  columnsState,
  onEnter,
  onScrollEnd,
  rows,
  setSelectedLog,
  sheetDimensions,
  sheetState,
  sort,
  sortByColumn,
  tableOptions,
}) => {
  const {
    onAutoScroll,
    onScrollUpdate,
    onSelectionUpdate,
    onToggleLock,
    state,
  } = sheetState;
  const { locked, scroll, selection } = state;
  return (
    <Sheet
      bindKeyHandlersRef={bindKeyHandlersRef}
      columns={columns}
      columnsState={columnsState}
      onAutoScroll={onAutoScroll}
      onEnter={onEnter}
      onScrollUpdate={onScrollUpdate}
      onSelectionUpdate={onSelectionUpdate}
      onToggleLock={onToggleLock}
      rows={rows}
      locked={locked}
      lockedColumns={lockedColumns(columns, locked, scroll, sheetDimensions)}
      onOutsideClick={sheetState.resetSelection}
      onResize={columnsState.resizeColumnByKey}
      onScrollEnd={onScrollEnd}
      scroll={scroll}
      selection={selection}
      sheetDimensions={sheetDimensions}
      sort={sort}
      sortByColumn={sortByColumn}
      tableOptions={tableOptions}
      tooltip={({ column, index, offsetTop, offsetX, offsetY, row }) => (
        <LogsSheetTooltip
          column={column}
          index={index}
          logs={rows}
          offsetTop={offsetTop}
          offsetX={offsetX}
          offsetY={offsetY}
          row={row}
          setSelectedLog={setSelectedLog}
          state={state}
        />
      )}
    />
  );
};

export default LogsSheetWithDimensions;
