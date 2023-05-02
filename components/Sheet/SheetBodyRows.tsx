import PropTypes from 'prop-types';
import React from 'react';
import SheetRow from './SheetRow';

const propTypes = {
  columns: PropTypes.array.isRequired,
  onScrollEnd: PropTypes.func,
  rows: PropTypes.array.isRequired,
  scroll: PropTypes.shape({}).isRequired,
  selection: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
};

const SheetBodyRows = ({
  columns,
  lockedColumns,
  onScrollEnd,
  rows,
  scroll,
  selection,
  sheetDimensions,
  tableOptions,
  tooltip,
}) => {
  const { firstRowIndex, firstRowOffset, scrollX, scrollY } = scroll;
  const { rowHeight, sheetBodyHeight } = sheetDimensions;
  const baseOffsetTop = firstRowOffset - rowHeight * firstRowIndex;
  const lastRowIndex = Math.min(
    firstRowIndex + Math.ceil(sheetBodyHeight / rowHeight),
    rows.length - 1,
  );

  const result = [];

  for (let i = firstRowIndex; i <= lastRowIndex; i += 1) {
    result.push(
      <SheetRow
        baseOffsetTop={baseOffsetTop}
        columns={columns}
        key={i}
        lockedColumns={lockedColumns}
        offsetTop={baseOffsetTop + rowHeight * i}
        onScrollEnd={i === rows.length - 1 ? onScrollEnd : null}
        row={rows[i]}
        scrollX={scrollX}
        scrollY={scrollY}
        selection={selection}
        sheetDimensions={sheetDimensions}
        tableOptions={tableOptions}
        tooltip={tooltip}
        y={i}
      />,
    );
  }

  return result;
};

SheetBodyRows.propTypes = propTypes;

export default SheetBodyRows;
