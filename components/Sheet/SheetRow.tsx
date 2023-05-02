import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { PanelPosition } from 'types';
import SheetCell from './SheetCell';
import getValue from './getValue';
import { TooltipTrigger } from '../TooltipTrigger';

const defaultProps = {
  renderCell: null,
};

const propTypes = {
  columns: PropTypes.array.isRequired,
  lockedColumns: PropTypes.shape({}).isRequired,
  offsetTop: PropTypes.number.isRequired,
  onScrollEnd: PropTypes.func,
  renderCellFromSheetRow: PropTypes.func,
  row: PropTypes.array.isRequired,
  scrollX: PropTypes.number.isRequired,
  selection: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
  y: PropTypes.number.isRequired,
};

const renderCell = ({ column, columnIndex, left, row }) => {
  const { renderCell } = column;
  const value = getValue({ column, row });

  if (renderCell) {
    return renderCell({ column, columnIndex, left, row, value });
  }

  return value;
};

const SheetRow = ({
  baseOffsetTop,
  columns,
  isHeader,
  locked,
  lockedColumns,
  offsetTop,
  onScrollEnd,
  renderCellFromSheetRow,
  row,
  scrollX,
  scrollY,
  selection,
  sheetDimensions,
  tableOptions,
  tooltip,
  y,
}) => {
  useEffect(() => {
    if (onScrollEnd) {
      onScrollEnd();
    }
  }, []);

  const { firstRightColumn, lastLeftColumn, lockedColumnsMap } = lockedColumns;
  const { columnLefts, rowHeight } = sheetDimensions;
  return (
    <div
      className={classnames({
        sheet__row: true,
        [`sheet__row--${tableOptions?.state?.linesToShow}`]:
          tableOptions?.state?.linesToShow,
      })}
      style={{
        height: `${isHeader ? 32 : rowHeight}px`,
        transform: `translate3d(-${scrollX}px, ${offsetTop}px, 0)`,
      }}
    >
      {columns.map((column, i) => {
        const { key, width } = column;
        const left =
          i in lockedColumnsMap ? lockedColumnsMap[i] : columnLefts[i];

        const isLastLeftColumn = i === lastLeftColumn;
        const isLocked = i in lockedColumnsMap;
        const isFirstRightColumn = i === firstRightColumn;

        if (renderCellFromSheetRow) {
          return renderCellFromSheetRow({
            column,
            columnIndex: i,
            columnLocked: Boolean(locked[i]),
            left,
            isLastLeftColumn,
            isLocked,
            isFirstRightColumn,
            row,
            scrollX,
            selection,
            width,
            x: i,
            y,
          });
        }

        return (
          <SheetCell
            baseOffsetTop={baseOffsetTop}
            className={classnames({
              'sheet__cell--locked': isLocked,
              'sheet__cell--locked-left': isLastLeftColumn,
              'sheet__cell--locked-right': isFirstRightColumn,
            })}
            cellWidth={width}
            column={column}
            key={key}
            left={left}
            offsetTop={offsetTop}
            row={row}
            scrollX={scrollX}
            scrollY={scrollY}
            selection={selection}
            sheetDimensions={sheetDimensions}
            tooltip={tooltip}
            x={i}
            y={y}
          >
            <div className="sheet__cell__text">
              {renderCell({
                column,
                columnIndex: i,
                left,
                row,
              })}
            </div>
          </SheetCell>
        );
      })}
    </div>
  );
};

SheetRow.defaultProps = defaultProps;
SheetRow.propTypes = propTypes;

export default SheetRow;
