import { keyCodes } from 'constants';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { toClipboard } from './clipboardUtils';
import {
  copyString,
  scrollByKey,
  selectionByKey,
  selectionByShiftKey,
} from './sheetUtils';

const defaultProps = {
  children: null,
  className: '',
};

const propTypes = {
  bindKeyHandlersRef: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onEnter: PropTypes.func,
  maxX: PropTypes.number.isRequired,
  maxY: PropTypes.number.isRequired,
  onAutoScroll: PropTypes.func.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selection: PropTypes.shape({}).isRequired,
  scroll: PropTypes.shape({}).isRequired,
  sheetDimensions: PropTypes.shape({}).isRequired,
};

class SheetKeyHandler extends Component {
  constructor() {
    super();
    this.bindKeyHandlers = this.bindKeyHandlers.bind(this);
    this.onArrowKey = this.onArrowKey.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.unbindKeyHandlers = this.unbindKeyHandlers.bind(this);
    this.domNode = null;
  }

  componentWillUnmount() {
    this.unbindKeyHandlers();
  }

  onArrowKey(e) {
    e.preventDefault();
    const { keyCode, shiftKey } = e;
    const { maxX, maxY, onAutoScroll, sheetDimensions } = this.props;
    const prevScroll = this.props.scroll;
    const prevSelection = this.props.selection;
    const { initX, initY } = prevSelection;

    if (initX === null || initY === null) {
      return;
    }

    const selection = shiftKey
      ? selectionByShiftKey(keyCode, maxX, maxY, prevSelection)
      : selectionByKey(keyCode, maxX, maxY, prevSelection);

    const scroll = scrollByKey(
      keyCode,
      prevScroll,
      maxY + 1,
      selection,
      sheetDimensions,
    );

    onAutoScroll(scroll, selection);
  }

  onCopy(e) {
    const { metaKey } = e;
    if (!metaKey) {
      return;
    }

    const { columns, rows, selection } = this.props;
    toClipboard(copyString(columns, rows, selection));
  }

  onKeyDown(e) {
    const { keyCode } = e;
    switch (keyCode) {
      case keyCodes.ENTER:
        this.onEnter();
      case keyCodes.C:
        this.onCopy(e);
        break;
      case keyCodes.DOWN:
      case keyCodes.LEFT:
      case keyCodes.RIGHT:
      case keyCodes.UP:
        this.onArrowKey(e);
        break;
      default:
    }
  }

  onEnter() {
    const { onEnter, selection } = this.props;
    if (onEnter) {
      onEnter({ selection });
    }
  }

  onMouseDown() {
    this.bindKeyHandlers();
  }

  onOutsideClick(e) {
    const { domNode, props } = this;
    const { target } = e;
    if (domNode && !domNode.contains(target)) {
      const { onOutsideClick } = props;
      this.unbindKeyHandlers();
      if (onOutsideClick) {
        onOutsideClick();
      }
    }
  }

  bindKeyHandlers() {
    document.addEventListener('click', this.onOutsideClick, null);
    document.addEventListener('keydown', this.onKeyDown, null);
  }

  unbindKeyHandlers() {
    document.removeEventListener('click', this.onOutsideClick, null);
    document.removeEventListener('keydown', this.onKeyDown, null);
  }

  render() {
    const { className, children, bindKeyHandlersRef } = this.props;

    return (
      <div
        className={className}
        onMouseDown={this.onMouseDown}
        ref={(node) => {
          this.domNode = node;
          bindKeyHandlersRef.current = this.bindKeyHandlers;
        }}
        role="button"
        tabIndex="-1"
      >
        {children}
      </div>
    );
  }
}

SheetKeyHandler.defaultProps = defaultProps;
SheetKeyHandler.propTypes = propTypes;

export default SheetKeyHandler;
