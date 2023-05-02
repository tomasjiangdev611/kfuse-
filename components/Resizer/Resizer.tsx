import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MouseMoveHelper } from 'utils';

const defaultProps = {
  children: null,
  className: '',
  onBottomClick: null,
  onTopClick: null,
};

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onBottomClick: PropTypes.func,
  onMouseMove: PropTypes.func.isRequired,
  onTopClick: PropTypes.func,
  orientation: PropTypes.string.isRequired,
};

class Resizer extends Component {
  constructor() {
    super();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.mouseMoveHelper = new MouseMoveHelper(
      document,
      this.onMouseDown,
      this.onMouseMove,
      this.onMouseUp,
    );

    this.state = {
      isDragging: false,
    };
  }

  onMouseDown(position, e) {
    e.stopPropagation();
    this.setState({ isDragging: true });
  }

  onMouseUp() {
    this.setState({ isDragging: false });
  }

  onMouseMove(position) {
    const { onMouseMove } = this.props;
    onMouseMove(position);
  }

  render() {
    const { children, className, onBottomClick, orientation, onTopClick } =
      this.props;
    const { isDragging } = this.state;

    return (
      <div
        className={classNames({
          resizer: true,
          [`resizer--${orientation}`]: true,
          [className]: className,
          'resizer--dragging': isDragging,
        })}
      >
        {onTopClick ? (
          <button
            className="resizer__button resizer__button--top"
            onClick={onTopClick}
          >
            <i className="resizer__button__icon ion-chevron-up" />
          </button>
        ) : null}
        <button
          className="resizer__handle"
          onMouseDown={this.mouseMoveHelper.onMouseDown}
        >
          {children}
        </button>
        {onBottomClick ? (
          <button
            className="resizer__button resizer__button--bottom"
            onClick={onBottomClick}
          >
            <i className="resizer__button__icon ion-chevron-down" />
          </button>
        ) : null}
      </div>
    );
  }
}

Resizer.defaultProps = defaultProps;
Resizer.propTypes = propTypes;

export default Resizer;
