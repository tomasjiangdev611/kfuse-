/* global document */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MouseMoveHelper } from 'utils';
import SheetBody from './SheetBody';
import SheetHeader from './SheetHeader';
import SheetKeyHandler from './SheetKeyHandler';
import SheetScrollbar from './SheetScrollbar';
import Timer from './Timer';
import WheelHandler from './WheelHandler';
import {
  autoScrollRate,
  scrollByDelta,
  selectionByMove,
  selectionShiftClick,
  selectionStart,
} from './sheetUtils';

const propTypes = {
  columns: PropTypes.array.isRequired,
  locked: PropTypes.shape({}).isRequired,
  lockedColumns: PropTypes.shape({}).isRequired,
  onAutoScroll: PropTypes.func.isRequired,
  onOutsideClick: PropTypes.func,
  onScrollUpdate: PropTypes.func.isRequired,
  onSelectionUpdate: PropTypes.func.isRequired,
  onToggleLock: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  scroll: PropTypes.shape({}).isRequired,
  selection: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
  sortRows: PropTypes.func.isRequired,
  tableOptions: PropTypes.shape({}).isRequired,
};

class Sheet extends Component {
  constructor(props) {
    super(props);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.selectMove = this.selectMove.bind(this);
    this.selectShiftClick = this.selectShiftClick.bind(this);
    this.selectStart = this.selectStart.bind(this);
    this.shouldHandleWheelX = this.shouldHandleWheelX.bind(this);
    this.shouldHandleWheelY = this.shouldHandleWheelY.bind(this);

    this.mouseMoveHelper = new MouseMoveHelper(
      document,
      this.onMouseDown,
      this.onMouseMove,
      this.onMouseUp,
    );

    this.timer = new Timer();

    this.wheelHandler = new WheelHandler(
      this.onScroll,
      this.shouldHandleWheelX,
      this.shouldHandleWheelY,
    );
  }

  onAutoScroll(autoScrollRateX, autoScrollRateY, clientX, clientY) {
    const deltaX = autoScrollRateX;
    const deltaY = autoScrollRateY;

    const { onAutoScroll, rows, scroll, selection, sheetDimensions } =
      this.props;

    onAutoScroll(
      scrollByDelta(deltaX, deltaY, rows.length, scroll, sheetDimensions),
      selectionByMove(
        clientX,
        clientY,
        rows.length,
        scroll,
        selection,
        sheetDimensions,
      ),
    );
  }

  onMouseDown({ clientX, clientY }, e) {
    const { shiftKey } = e;
    const { selection } = this.props;
    const { initX, initY } = selection;
    const prevSelection = initX !== null || initY !== null;

    if (prevSelection && shiftKey) {
      this.selectShiftClick(clientX, clientY);
    } else {
      this.selectStart(clientX, clientY);
    }
  }

  onMouseMove({ clientX, clientY }) {
    const { selection, sheetDimensions } = this.props;
    const { startY } = selection;
    const headerSelection = startY === -1;

    const {
      sheetBodyHeight,
      sheetHeight,
      sheetWidth,
      sheetOffsetX,
      sheetOffsetY,
      sheetBodyOffsetY,
    } = sheetDimensions;
    const autoScrollRateX = autoScrollRate(
      sheetOffsetX,
      0.05,
      clientX,
      sheetWidth,
    );

    const autoScrollRateY = autoScrollRate(
      headerSelection ? sheetOffsetY - sheetHeight * 0.05 : sheetBodyOffsetY,
      0.05,
      clientY,
      headerSelection ? sheetHeight : sheetBodyHeight,
    );

    if (autoScrollRateX || autoScrollRateY) {
      this.timer.setInterval(
        this.onAutoScroll.bind(
          this,
          autoScrollRateX,
          autoScrollRateY,
          clientX,
          clientY,
        ),
        5,
      );
    } else {
      this.timer.clearInterval();
      this.selectMove(clientX, clientY);
    }
  }

  onMouseUp() {
    this.timer.clearInterval();
  }

  onScroll(deltaX, deltaY) {
    const { onScrollUpdate, rows, scroll, sheetDimensions } = this.props;

    onScrollUpdate(
      scrollByDelta(deltaX, deltaY, rows.length, scroll, sheetDimensions),
    );
  }

  selectMove(clientX, clientY) {
    const { onSelectionUpdate, rows, scroll, selection, sheetDimensions } =
      this.props;

    onSelectionUpdate(
      selectionByMove(
        clientX,
        clientY,
        rows.length,
        scroll,
        selection,
        sheetDimensions,
      ),
    );
  }

  selectShiftClick(clientX, clientY) {
    const { onSelectionUpdate, rows, scroll, selection, sheetDimensions } =
      this.props;

    onSelectionUpdate(
      selectionShiftClick(
        clientX,
        clientY,
        rows.length,
        scroll,
        selection,
        sheetDimensions,
      ),
    );
  }

  selectStart(clientX, clientY) {
    const { onSelectionUpdate, rows, scroll, sheetDimensions } = this.props;
    const selection = selectionStart(
      clientX,
      clientY,
      rows.length,
      scroll,
      sheetDimensions,
    );

    onSelectionUpdate(selection);
  }

  shouldHandleWheelX(deltaX) {
    const roundedDeltaX = Math.round(deltaX);
    if (roundedDeltaX === 0) {
      return false;
    }

    const { scroll, sheetDimensions } = this.props;
    const { scrollX } = scroll;
    const { maxScrollX } = sheetDimensions;

    return (
      (roundedDeltaX < 0 && scrollX > 0) ||
      (roundedDeltaX >= 0 && scrollX < maxScrollX)
    );
  }

  shouldHandleWheelY(deltaY) {
    const roundedDeltaY = Math.round(deltaY);

    if (roundedDeltaY === 0) {
      return false;
    }

    const { scroll, sheetDimensions } = this.props;
    const { scrollY } = scroll;
    const { maxScrollY } = sheetDimensions;

    return (
      (roundedDeltaY < 0 && scrollY > 0) ||
      (roundedDeltaY >= 0 && scrollY < maxScrollY)
    );
  }

  render() {
    const {
      columns,
      columnsState,
      locked,
      lockedColumns,
      onAutoScroll,
      onEnter,
      onOutsideClick,
      onResize,
      onScrollEnd,
      onToggleLock,
      rows,
      scroll,
      selection,
      sheetDimensions,
      bindKeyHandlersRef,
      sort,
      sortByColumn,
      tableOptions,
      tooltip,
    } = this.props;
    const { scrollX } = scroll;
    const { contentWidth, maxScrollX, sheetWidth } = sheetDimensions;

    return (
      <div
        className="sheet"
        onMouseDown={this.mouseMoveHelper.onMouseDown}
        role="button"
        style={{ width: `${sheetWidth}px` }}
        tabIndex="-1"
      >
        <SheetKeyHandler
          bindKeyHandlersRef={bindKeyHandlersRef}
          className="sheet__inner"
          columns={columns}
          maxX={columns.length - 1}
          maxY={rows.length - 1}
          onAutoScroll={onAutoScroll}
          onEnter={onEnter}
          onOutsideClick={onOutsideClick}
          rows={rows}
          scroll={scroll}
          selection={selection}
          sheetDimensions={sheetDimensions}
        >
          <SheetHeader
            columns={columns}
            columnsState={columnsState}
            locked={locked}
            lockedColumns={lockedColumns}
            onResize={onResize}
            onToggleLock={onToggleLock}
            scrollX={scrollX}
            selection={selection}
            sheetDimensions={sheetDimensions}
            sort={sort}
            sortByColumn={sortByColumn}
          />
          <SheetBody
            columns={columns}
            lockedColumns={lockedColumns}
            onScroll={this.onScroll}
            onScrollEnd={onScrollEnd}
            onWheel={this.wheelHandler.onWheel}
            rows={rows}
            scroll={scroll}
            selection={selection}
            sheetDimensions={sheetDimensions}
            tableOptions={tableOptions}
            tooltip={tooltip}
          />
        </SheetKeyHandler>
        <SheetScrollbar
          contentSize={contentWidth}
          horizontal
          onScroll={this.onScroll}
          offset={0}
          maxScroll={maxScrollX}
          position={scrollX}
          viewportSize={sheetWidth}
        />
      </div>
    );
  }
}

Sheet.propTypes = propTypes;

export default Sheet;
