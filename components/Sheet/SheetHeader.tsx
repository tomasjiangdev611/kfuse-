import PropTypes from 'prop-types';
import React from 'react';
import SheetHeaderCell from './SheetHeaderCell';
import SheetRow from './SheetRow';

const propTypes = {
  columns: PropTypes.array.isRequired,
  locked: PropTypes.shape({}).isRequired,
  lockedColumns: PropTypes.shape({}).isRequired,
  onResize: PropTypes.func.isRequired,
  onToggleLock: PropTypes.func.isRequired,
  scrollX: PropTypes.number.isRequired,
  selection: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
  sortRows: PropTypes.func.isRequired,
};

const SheetHeader = ({
  columns,
  columnsState,
  locked,
  lockedColumns,
  onResize,
  onToggleLock,
  scrollX,
  selection,
  sheetDimensions,
  sort,
  sortByColumn,
}) => (
  <div className="sheet__header" style={{ height: '32px' }}>
    <SheetRow
      columns={columns}
      isHeader
      locked={locked}
      lockedColumns={lockedColumns}
      offsetTop={0}
      renderCellFromSheetRow={(props) => (
        <SheetHeaderCell
          {...props}
          columnsState={columnsState}
          onResize={onResize}
          onToggleLock={onToggleLock}
          scrollX={scrollX}
          sheetDimensions={sheetDimensions}
          sort={sort}
          sortByColumn={sortByColumn}
        />
      )}
      row={columns.map(({ name }) => name)}
      scrollX={scrollX}
      selection={selection}
      sheetDimensions={sheetDimensions}
      y={-1}
    />
  </div>
);

SheetHeader.propTypes = propTypes;

export default SheetHeader;
