/* global document */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MouseMoveHelper } from 'utils';
import { emptyFunction } from './functionUtils';

const defaultProps = {
  horizontal: false,
};

const propTypes = {
  contentSize: PropTypes.number.isRequired,
  horizontal: PropTypes.bool,
  maxScroll: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  onScroll: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  viewportSize: PropTypes.number.isRequired,
};

const MARGIN = 2;

const barStyle = (contentSize, horizontal, position, viewportSize) => {
  const barSize = Math.max((viewportSize * viewportSize) / contentSize, 20);
  const marginedSize = barSize - MARGIN * 2;
  const translate =
    (position / (contentSize - viewportSize)) * (viewportSize - barSize) +
    MARGIN;
  const translateX = horizontal ? translate : MARGIN;
  const translateY = horizontal ? MARGIN : translate;

  return {
    [horizontal ? 'width' : 'height']: marginedSize,
    transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
  };
};

class SheetScrollbar extends Component {
  constructor() {
    super();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.mouseMoveHelper = new MouseMoveHelper(
      document,
      emptyFunction,
      this.onMouseMove,
      emptyFunction,
    );
  }

  componentWillUnmount() {
    this.mouseMoveHelper.onMouseUp();
  }

  onMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    const { contentSize, horizontal, onScroll, position, viewportSize } =
      this.props;

    const target = e.target || e.srcElement;
    const rect = target.getBoundingClientRect();
    const offset = horizontal ? e.clientX - rect.left : e.clientY - rect.top;
    const delta = (offset / viewportSize) * contentSize - position;

    if (horizontal) {
      onScroll(delta, 0);
    } else {
      onScroll(0, delta);
    }
  }

  onMouseMove({ clientX, clientY, deltaX, deltaY }) {
    const {
      contentSize,
      horizontal,
      maxScroll,
      offset,
      position,
      viewportSize,
    } = this.props;

    const client = horizontal ? clientX : clientY;
    const delta = horizontal ? deltaX : deltaY;
    const deltaPositive = delta > 0;

    if (deltaPositive && (client < offset || position === maxScroll)) {
      return;
    }

    if (!deltaPositive && client > offset + viewportSize) {
      return;
    }

    this.onScroll(delta * (contentSize / viewportSize));
  }

  onScroll(scrollDelta) {
    const { horizontal, onScroll } = this.props;

    if (horizontal) {
      onScroll(scrollDelta, 0);
    } else {
      onScroll(0, scrollDelta);
    }
  }

  render() {
    const { contentSize, horizontal, position, viewportSize } = this.props;

    if (viewportSize >= contentSize) {
      return null;
    }

    return (
      <div
        className={classNames({
          'sheet-scrollbar': true,
          'sheet-scrollbar--horizontal': horizontal,
        })}
      >
        <div
          className="sheet-scrollbar__inner"
          onMouseDown={this.onMouseDown}
          role="button"
          tabIndex="-1"
        >
          <div
            className="sheet-scrollbar__bar"
            onMouseDown={this.mouseMoveHelper.onMouseDown}
            role="button"
            style={barStyle(contentSize, horizontal, position, viewportSize)}
            tabIndex="-1"
          />
        </div>
      </div>
    );
  }
}

SheetScrollbar.defaultProps = defaultProps;
SheetScrollbar.propTypes = propTypes;

export default SheetScrollbar;
