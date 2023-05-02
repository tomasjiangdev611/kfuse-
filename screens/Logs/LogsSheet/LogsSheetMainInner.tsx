import React, { useMemo } from 'react';
import LogsSheetMainWithDimensions from './LogsSheetMainWithDimensions';

const getColumns = ({ baseColumns, sheetWidth }) => {
  const baseColumnsWidth = baseColumns.reduce(
    (sum, column) => sum + column.width,
    0,
  );

  const nextColumns = [...baseColumns];
  const diff = sheetWidth - baseColumnsWidth;

  if (diff > 0 && nextColumns.length) {
    const lastColumn = nextColumns[nextColumns.length - 1];
    lastColumn.width += diff;
  }

  return nextColumns;
};

const getColumnLefts = ({ columns }) => {
  let total = 0;
  const result = [];

  for (let i = 0, columnsLength = columns.length; i < columnsLength; i += 1) {
    result.push(total);
    total += columns[i].width;
  }

  return result;
};

const getSheetDimensions = ({
  baseColumns,
  offsetX,
  offsetY,
  rows,
  width,
  height,
  tableOptions,
}) => {
  const { linesToShow } = tableOptions.state;
  const sheetHeight = height;
  const sheetWidth = width;

  const columns = getColumns({ baseColumns, sheetWidth });
  const rowHeight = 16 + 16 * linesToShow;
  const columnLefts = getColumnLefts({ columns });
  const contentHeight = rowHeight * rows.length;
  const contentWidth = columns.reduce((sum, column) => sum + column.width, 0);

  const sheetBodyHeight = sheetHeight - 32;
  const sheetOffsetX = offsetX;
  const sheetOffsetY = offsetY;

  const sheetBodyOffsetY = sheetOffsetY + 32;
  const maxScrollX = Math.max(contentWidth - sheetWidth, 0);
  const maxScrollY = Math.max(contentHeight - sheetHeight + 32, 0);

  const sheetDimensions = {
    columnLefts,
    contentHeight,
    contentWidth,
    maxScrollX,
    maxScrollY,
    rowHeight,
    sheetBodyHeight,
    sheetBodyOffsetY,
    sheetHeight,
    sheetOffsetX,
    sheetOffsetY,
    sheetSidebarWidth: 0,
    sheetWidth,
  };

  return { columns, sheetDimensions };
};

const LogsSheetInner = ({
  bindKeyHandlersRef,
  columns: baseColumns,
  columnsState,
  height,
  rows,
  offsetX,
  offsetY,
  onEnter,
  onScrollEnd,
  setSelectedLog,
  sheetState,
  sort,
  sortByColumn,
  tableOptions,
  width,
}) => {
  const { columns, sheetDimensions } = useMemo(
    () =>
      getSheetDimensions({
        baseColumns,
        rows,
        offsetX,
        offsetY,
        width,
        height,
        tableOptions,
      }),
    [baseColumns, offsetX, offsetY, height, width, rows, tableOptions.state],
  );
  return (
    <LogsSheetMainWithDimensions
      bindKeyHandlersRef={bindKeyHandlersRef}
      columns={columns}
      columnsState={columnsState}
      onEnter={onEnter}
      onScrollEnd={onScrollEnd}
      rows={rows}
      setSelectedLog={setSelectedLog}
      sheetDimensions={sheetDimensions}
      sheetState={sheetState}
      sort={sort}
      sortByColumn={sortByColumn}
      tableOptions={tableOptions}
    />
  );
};

export default LogsSheetInner;
