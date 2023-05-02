import classNames from 'classnames';
import { Resizer, ResizerOrientation } from 'components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { TfiLock } from 'react-icons/tfi';
import SheetCell from './SheetCell';
import SheetHeaderCellMore from './SheetHeaderCellMore';
import { PopoverTriggerV2, PopoverPosition } from '../PopoverTriggerV2';

const propTypes = {
  column: PropTypes.shape({}).isRequired,
  columnLocked: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onToggleLock: PropTypes.number.isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
  value: PropTypes.string.isRequired,
};

const getArrow = ({ column, sort }) => {
  const { key } = column;
  const { sortBy, sortOrder } = sort;
  if (key === sortBy) {
    if (sortOrder === 'Asc') {
      return (
        <div className="sheet-header-cell__arrow">
          <FaLongArrowAltUp />
        </div>
      );
    }

    return (
      <div className="sheet-header-cell__arrow sheet-header-cell__arrow--down">
        <FaLongArrowAltDown />
      </div>
    );
  }

  if (!sortBy && key === 'timestamp') {
    return (
      <div className="sheet-header-cell__arrow sheet-header-cell__arrow--down">
        <FaLongArrowAltDown />
      </div>
    );
  }

  return '';
};

class SheetHeaderCell extends Component {
  constructor() {
    super();
    this.onToggleLock = this.onToggleLock.bind(this);
  }

  onToggleLock() {
    const { columnIndex, onToggleLock } = this.props;
    onToggleLock(columnIndex);
  }

  render() {
    const {
      column,
      columnIndex,
      columnLocked,
      columnsState,
      isFirstRightColumn,
      isLastLeftColumn,
      isLocked,
      left,
      onResize,
      scrollX,
      selection,
      sheetDimensions,
      sort,
      sortByColumn,
      value,
      width,
      x,
      y,
    } = this.props;
    const { key, label } = column;
    const { sortBy } = sort;

    const isSorted = key === sortBy;
    const { sheetOffsetX, sheetOffsetY } = sheetDimensions;

    const onMouseMove = ({ deltaX }) => {
      onResize(key, deltaX);
    };

    return (
      <SheetCell
        className={classNames({
          'sheet__cell--locked': isLocked,
          'sheet__cell--locked-left': isLastLeftColumn,
          'sheet__cell--locked-right': isFirstRightColumn,
        })}
        cellWidth={width}
        key={key}
        left={left}
        selection={selection}
        sheetDimensions={sheetDimensions}
        x={x}
        y={y}
      >
        <div className="sheet__cell__text">
          <div
            className={classNames({
              'sheet-header-cell': true,
              'sheet-header-cell--locked': isLocked,
              'sheet-header-cell--sorted': isSorted,
            })}
          >
            {getArrow({
              column,
              sort,
            })}
            <div className="sheet-header-cell__value">
              <span>{label}</span>
            </div>
            {columnLocked ? (
              <div className="sheet-header-cell__lock">
                <TfiLock />
              </div>
            ) : null}
            <PopoverTriggerV2
              className="sheet-header-cell__more"
              offsetX={-sheetOffsetX + scrollX}
              offsetY={-sheetOffsetY}
              popover={(props) => (
                <SheetHeaderCellMore
                  {...props}
                  column={column}
                  columnLocked={columnLocked}
                  columnsState={columnsState}
                  index={columnIndex}
                  onToggleLock={this.onToggleLock}
                  sortByColumn={sortByColumn}
                />
              )}
              position={PopoverPosition.BOTTOM_RIGHT}
              shouldUseClickOnOutsideClick
              shouldStopMouseDownPropagation
            >
              <FiMoreVertical />
            </PopoverTriggerV2>
          </div>
        </div>
        <Resizer
          onMouseMove={onMouseMove}
          orientation={ResizerOrientation.vertical}
        />
      </SheetCell>
    );
  }
}

SheetHeaderCell.propTypes = propTypes;

export default SheetHeaderCell;
