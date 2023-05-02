import PropTypes from 'prop-types';
import React from 'react';
import SheetBodyRows from './SheetBodyRows';
import SheetScrollbar from './SheetScrollbar';

const propTypes = {
  columns: PropTypes.array.isRequired,
  lockedColumns: PropTypes.shape({}).isRequired,
  onScroll: PropTypes.func.isRequired,
  onWheel: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  selection: PropTypes.shape({}).isRequired,
  scroll: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
};

const SheetBody = ({
  columns,
  lockedColumns,
  onScroll,
  onScrollEnd,
  onWheel,
  rows,
  scroll,
  selection,
  sheetDimensions,
  tableOptions,
  tooltip,
}) => {
  const { contentHeight, maxScrollY, sheetBodyOffsetY, sheetBodyHeight } =
    sheetDimensions;

  return (
    <div
      className="sheet__body"
      onWheel={onWheel}
      style={{ height: `${sheetBodyHeight}px` }}
    >
      <SheetBodyRows
        columns={columns}
        lockedColumns={lockedColumns}
        onScrollEnd={onScrollEnd}
        rows={rows}
        scroll={scroll}
        selection={selection}
        sheetDimensions={sheetDimensions}
        tableOptions={tableOptions}
        tooltip={tooltip}
      />
      <SheetScrollbar
        contentSize={contentHeight}
        maxScroll={maxScrollY}
        offset={sheetBodyOffsetY}
        onScroll={onScroll}
        position={scroll.scrollY}
        viewportSize={sheetBodyHeight}
      />
    </div>
  );
};

SheetBody.propTypes = propTypes;

export default SheetBody;
