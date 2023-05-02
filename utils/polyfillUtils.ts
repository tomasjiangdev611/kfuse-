export const cancelAnimationFramePolyfill =
  global.cancelAnimationFrame ||
  global.webkitCancelAnimationFrame ||
  global.mozCancelAnimationFrame ||
  global.oCancelAnimationFrame ||
  global.msCancelAnimationFrame ||
  global.clearTimeout;

const nativeRequestAnimationFrame =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  global.msRequestAnimationFrame;

let lastTime = 0;

const customRequestAnimationFrame = (callback) => {
  const currentTime = Date.now();
  const timeDelay = Math.max(0, 16 - (currentTime - lastTime));
  lastTime = currentTime + timeDelay;

  return setTimeout(() => {
    callback(Date.now());
  }, timeDelay);
};

export const requestAnimationFramePolyfill =
  nativeRequestAnimationFrame || customRequestAnimationFrame;

export default requestAnimationFramePolyfill;
