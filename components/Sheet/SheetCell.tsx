import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const defaultProps = {
  className: '',
};

const propTypes = {
  cellWidth: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  left: PropTypes.number.isRequired,
  selection: PropTypes.shape({}).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

const SheetCell = ({
  baseOffsetTop,
  cellWidth,
  children,
  className,
  column,
  left,
  offsetTop,
  row,
  scrollX,
  scrollY,
  selection,
  sheetDimensions,
  tooltip,
  x,
  y,
}) => {
  const { initX, initY, startX, startY, endX, endY } = selection;
  const { sheetOffsetX, sheetOffsetY } = sheetDimensions;
  const isSelected =
    startX !== null &&
    endX !== null &&
    startY !== null &&
    endY !== null &&
    x >= startX &&
    x <= endX &&
    y >= startY &&
    y <= endY;

  const isSelectedInit = isSelected && x === initX && y === initY;
  const offsetX = -sheetOffsetX + scrollX;
  const offsetY = -sheetOffsetY - (offsetTop - baseOffsetTop) + scrollY - 36;

  return (
    <div
      className={classNames({
        sheet__cell: true,
        'sheet__cell--selected': isSelected,
        'sheet__cell--selected-border-left':
          isSelected && startX === x && !isSelectedInit,
        'sheet__cell--selected-border-right':
          isSelected && endX === x && !isSelectedInit,
        'sheet__cell--selected-border-top':
          isSelected && startY === y && !isSelectedInit,
        'sheet__cell--selected-border-bottom':
          isSelected && endY === y && !isSelectedInit,
        'sheet__cell--selected-init': isSelectedInit,
        [className]: className,
      })}
      style={{ left: `${left}px`, width: `${cellWidth}px` }}
    >
      {children}
      {tooltip ? (
        <div className="sheet__cell__actions">
          {tooltip({ column, index: y, offsetX, offsetY, offsetTop, row })}
        </div>
      ) : null}
    </div>
  );
};

SheetCell.defaultProps = defaultProps;
SheetCell.propTypes = propTypes;

export default SheetCell;
