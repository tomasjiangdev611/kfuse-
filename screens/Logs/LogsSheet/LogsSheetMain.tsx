import { SizeObserver } from 'components';
import React from 'react';
import LogsSheetMainInner from './LogsSheetMainInner';

const LogsSheetMain = ({
  bindKeyHandlersRef,
  columns,
  columnsState,
  onEnter,
  onScrollEnd,
  rows,
  setSelectedLog,
  sheetState,
  sort,
  sortByColumn,
  tableOptions,
}) => {
  return (
    <SizeObserver className="logs__sheet">
      {({ height, offsetX, offsetY, width }) => (
        <LogsSheetMainInner
          bindKeyHandlersRef={bindKeyHandlersRef}
          columns={columns}
          columnsState={columnsState}
          height={height}
          offsetX={offsetX}
          offsetY={offsetY}
          onEnter={onEnter}
          onScrollEnd={onScrollEnd}
          rows={rows}
          setSelectedLog={setSelectedLog}
          sheetState={sheetState}
          sort={sort}
          sortByColumn={sortByColumn}
          tableOptions={tableOptions}
          width={width}
        />
      )}
    </SizeObserver>
  );
};

export default LogsSheetMain;
