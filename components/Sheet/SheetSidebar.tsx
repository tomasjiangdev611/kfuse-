import PropTypes from 'prop-types';
import React from 'react';
import SheetCharts from './SheetCharts';

const propTypes = {
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  selection: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
};

const SheetSidebar = ({ columns, rows, selection, sheetDimensions }) => {
  const { sheetHeight, sheetSidebarWidth } = sheetDimensions;

  return (
    <div className="sheet-sidebar" style={{ height: `${sheetHeight}px` }}>
      <SheetCharts
        columns={columns}
        height={80}
        rows={rows}
        selection={selection}
        width={sheetSidebarWidth - 24}
      />
    </div>
  );
};

SheetSidebar.propTypes = propTypes;

export default SheetSidebar;
