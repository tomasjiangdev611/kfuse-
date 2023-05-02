/* eslint-env browser */
import {
  cancelAnimationFramePolyfill,
  requestAnimationFramePolyfill,
} from 'utils';
import { getCoordinatesFromEvent } from './eventUtils';

class MouseMoveHelper {
  constructor(
    domNode,
    onMouseDownCallback,
    onMouseMoveCallback,
    onMouseUpCallback,
  ) {
    this.animationFrameId = null;
    this.deltaX = 0;
    this.deltaY = 0;
    this.domNode = domNode;
    this.clientX = 0;
    this.clientY = 0;

    this.didMouseMove = this.didMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseDownCallback = onMouseDownCallback;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseUpCallback = onMouseUpCallback;
  }

  didMouseMove() {
    this.animationFrameId = null;
    this.onMouseMoveCallback({
      clientX: this.clientX,
      clientY: this.clientY,
      deltaX: this.deltaX,
      deltaY: this.deltaY,
    });
    this.deltaX = 0;
    this.deltaY = 0;
  }

  onMouseDown(e) {
    e.preventDefault();
    this.domNode.addEventListener('mousemove', this.onMouseMove, false);
    this.domNode.addEventListener('mouseup', this.onMouseUp, false);

    const { clientX, clientY } = getCoordinatesFromEvent(e);

    this.deltaX = 0;
    this.deltaY = 0;
    this.clientX = clientX;
    this.clientY = clientY;
    this.onMouseDownCallback({ clientX, clientY }, e);
  }

  onMouseMove(e) {
    e.preventDefault();
    const { clientX, clientY } = getCoordinatesFromEvent(e);

    this.deltaX += clientX - this.clientX;
    this.deltaY += clientY - this.clientY;
    this.clientX = clientX;
    this.clientY = clientY;

    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFramePolyfill(this.didMouseMove);
    }
  }

  onMouseUp() {
    this.domNode.removeEventListener('mousemove', this.onMouseMove, false);
    this.domNode.removeEventListener('mouseup', this.onMouseUp, false);

    if (this.animationFrameId !== null) {
      cancelAnimationFramePolyfill(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.onMouseUpCallback();
  }
}

export default MouseMoveHelper;
