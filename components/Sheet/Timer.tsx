import {
  cancelAnimationFramePolyfill,
  requestAnimationFramePolyfill,
} from 'utils';
import { emptyFunction } from './functionUtils';

class Timer {
  constructor() {
    this.animationFrameId = null;
    this.delay = 0;
    this.onTickCallback = emptyFunction;
    this.start = null;

    this.onTick = this.onTick.bind(this);
  }

  clearInterval() {
    if (this.animationFrameId) {
      cancelAnimationFramePolyfill(this.animationFrameId);
    }

    this.start = null;
  }

  onTick() {
    const current = new Date().getTime();
    const delta = current - this.start;

    if (delta >= this.delay) {
      this.onTickCallback();
      this.start = new Date().getTime();
    }

    this.animationFrameId = requestAnimationFramePolyfill(this.onTick);
  }

  setInterval(onTickCallback, delay) {
    this.delay = delay;
    this.onTickCallback = onTickCallback;

    if (this.start === null) {
      this.start = new Date().getTime();
      this.animationFrameId = requestAnimationFramePolyfill(this.onTick);
    }
  }
}

export default Timer;
