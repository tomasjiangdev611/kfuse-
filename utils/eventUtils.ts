const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;

export const getCoordinatesFromEvent = (e) => {
  if (e.clientX && e.clientY) {
    return {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }

  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
  }

  return {
    clientX: 0,
    clientY: 0,
  };
};

export const normalizeWheelEvent = (e) => {
  let spinX = 0;
  let spinY = 0;
  let pixelX = 0;
  let pixelY = 0;

  if ('detail' in e) {
    spinY = e.detail;
  }
  if ('wheelDelta' in e) {
    spinY = -e.wheelDelta / 120;
  }
  if ('wheelDeltaY' in e) {
    spinY = -e.wheelDeltaY / 120;
  }
  if ('wheelDeltaX' in e) {
    spinX = -e.wheelDeltaX / 120;
  }

  const sideScrollingWithDomMouseScroll =
    'axis' in e && e.axis === e.HORIZONTAL_AXIS;

  if (sideScrollingWithDomMouseScroll) {
    spinX = spinY;
    spinY = 0;
  }

  pixelX = spinX * PIXEL_STEP;
  pixelY = spinY * PIXEL_STEP;

  if ('deltaY' in e) {
    pixelY = e.deltaY;
  }
  if ('deltaX' in e) {
    pixelX = e.deltaX;
  }

  if ((pixelX || pixelY) && e.deltaMode) {
    if (e.deltaMode === 1) {
      pixelX *= LINE_HEIGHT;
      pixelY *= LINE_HEIGHT;
    } else {
      pixelX *= PAGE_HEIGHT;
      pixelY *= PAGE_HEIGHT;
    }
  }

  if (e.shiftKey) {
    const spinTmp = spinX;
    const pixelTmp = pixelX;
    spinX = spinY;
    spinY = spinTmp;
    pixelX = pixelY;
    pixelY = pixelTmp;
  }

  return {
    spinX,
    spinY,
    pixelX,
    pixelY,
  };
};
