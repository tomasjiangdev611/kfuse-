import { normalizeWheelEvent, requestAnimationFramePolyfill } from 'utils';

class WheelHandler {
  constructor(onWheel, shouldHandleWheelX, shouldHandleWheelY) {
    this.animationFrameId = null;
    this.deltaX = 0;
    this.deltaY = 0;
    this.didWheel = this.didWheel.bind(this);
    this.shouldHandleWheelX = shouldHandleWheelX;
    this.shouldHandleWheelY = shouldHandleWheelY;
    this.onWheelCallback = onWheel;
    this.onWheel = this.onWheel.bind(this);
  }

  didWheel() {
    this.animationFrameId = null;
    this.onWheelCallback(this.deltaX, this.deltaY);
    this.deltaX = 0;
    this.deltaY = 0;
  }

  onWheel(e) {
    const normalizedEvent = normalizeWheelEvent(e);
    const { pixelX, pixelY } = normalizedEvent;

    const deltaX = this.deltaX + pixelX;
    const deltaY = this.deltaY + pixelY;

    const shouldHandleWheelX = this.shouldHandleWheelX(deltaX);
    const shouldHandleWheelY = this.shouldHandleWheelY(deltaY);
    if (!shouldHandleWheelX && !shouldHandleWheelY) {
      return;
    }

    this.deltaX += shouldHandleWheelX ? pixelX : 0;
    this.deltaY += shouldHandleWheelY ? pixelY : 0;
    e.preventDefault();

    const changed = this.deltaX !== 0 || this.deltaY !== 0;

    if (changed && this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFramePolyfill(this.didWheel);
    }
  }
}

export default WheelHandler;
