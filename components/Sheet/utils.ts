import { keyCodes } from 'constants';
import clamp from './numberUtils';

const NO_ROWS_SCROLL_RESULT = {
  firstRowIndex: 0,
  firstRowOffset: 0,
  scrollY: 0,
};

export const scrollByDeltaY = (
  deltaY,
  maxScrollY,
  rowHeight,
  rowsCount,
  scroll,
) => {
  if (rowsCount === 0) {
    return NO_ROWS_SCROLL_RESULT;
  }

  const scrollY = clamp(scroll.scrollY + deltaY, 0, maxScrollY);
  const firstRowIndex = clamp(
    Math.floor(scrollY / rowHeight),
    0,
    rowsCount - 1,
  );

  const newFirstRowPositon = firstRowIndex * rowHeight;
  const firstRowOffset = newFirstRowPositon - scrollY;

  return {
    firstRowIndex,
    firstRowOffset,
    scrollY,
  };
};

export const scrollByDelta = (
  deltaX,
  deltaY,
  rowsCount,
  scroll,
  sheetDimensions,
) => {
  const { scrollX } = scroll;
  const { maxScrollX, maxScrollY, rowHeight } = sheetDimensions;

  return {
    scrollX: clamp(scrollX + deltaX, 0, maxScrollX),
    ...scrollByDeltaY(deltaY, maxScrollY, rowHeight, rowsCount, scroll),
  };
};

export const autoScrollRate = (
  offset,
  marginThresholdPercentage,
  position,
  size,
) => {
  const marginThreshold = size * marginThresholdPercentage;
  const midpoint = size / 2;
  const relativePosition = position - offset;

  const beyondMarginThreshold =
    Math.abs(relativePosition - midpoint) >= midpoint - marginThreshold;

  if (beyondMarginThreshold) {
    if (relativePosition < marginThreshold) {
      return Math.round(relativePosition - marginThreshold);
    }

    if (relativePosition > marginThreshold) {
      return Math.round(relativePosition - (size - marginThreshold));
    }
  }

  return 0;
};

const calcCellX = (clientX, scroll, sheetDimensions) => {
  const { scrollX } = scroll;
  const { columnLefts, sheetOffsetX } = sheetDimensions;
  const sheetX = clientX - sheetOffsetX + scrollX;

  for (let i = columnLefts.length - 1; i >= 0; i -= 1) {
    if (sheetX > columnLefts[i]) {
      return i;
    }
  }

  return 0;
};

const calcCellY = (clientY, scroll, sheetDimensions) => {
  const { firstRowIndex, firstRowOffset } = scroll;
  const { rowHeight, sheetBodyOffsetY } = sheetDimensions;
  const sheetY = clientY - sheetBodyOffsetY - firstRowOffset;

  return Math.floor(sheetY / rowHeight) + firstRowIndex;
};

const isHeaderClicked = (clientY, sheetDimensions) => {
  const { sheetOffsetY, sheetBodyOffsetY } = sheetDimensions;
  return Boolean(clientY >= sheetOffsetY && clientY < sheetBodyOffsetY);
};

export const selectionByMove = (
  clientX,
  clientY,
  rowsCount,
  scroll,
  selection,
  sheetDimensions,
) => {
  const headerSelection = selection.startY === -1;
  const cellX = calcCellX(clientX, scroll, sheetDimensions);
  const cellY = calcCellY(clientY, scroll, sheetDimensions);

  const startX = Math.min(cellX, selection.initX);
  const startY = Math.min(cellY, selection.initY);
  const endX = Math.max(cellX, selection.initX);
  const endY = Math.max(cellY, selection.initY);

  if (headerSelection) {
    return {
      startX,
      endX,
    };
  }

  const maxY = rowsCount - 1;

  return {
    startX,
    startY: clamp(startY, 0, maxY),
    endX,
    endY: clamp(endY, 0, maxY),
  };
};

export const selectionShiftClick = (
  clientX,
  clientY,
  rowsCount,
  scroll,
  selection,
  sheetDimensions,
) => {
  const { initX, initY } = selection;
  const headerClicked = isHeaderClicked(clientY, sheetDimensions);
  const cellX = calcCellX(clientX, scroll, sheetDimensions);
  const cellY = calcCellY(clientY, scroll, sheetDimensions);

  return {
    startX: Math.min(cellX, initX),
    startY: headerClicked ? -1 : Math.min(cellY, initY),
    endX: Math.max(cellX, initX),
    endY: headerClicked ? rowsCount - 1 : Math.max(cellY, initY),
  };
};

export const selectionStart = (
  clientX,
  clientY,
  rowsCount,
  scroll,
  sheetDimensions,
) => {
  const cellX = calcCellX(clientX, scroll, sheetDimensions);
  const cellY = calcCellY(clientY, scroll, sheetDimensions);
  const headerClicked = isHeaderClicked(clientY, sheetDimensions);

  return {
    initX: cellX,
    initY: headerClicked ? 0 : cellY,
    startX: cellX,
    startY: headerClicked ? -1 : cellY,
    endX: cellX,
    endY: headerClicked ? rowsCount - 1 : cellY,
  };
};

export const selectionByKey = (keyCode, maxX, maxY, prevSelection) => {
  const { initX, initY } = prevSelection;

  switch (keyCode) {
    case keyCodes.UP:
    case keyCodes.DOWN: {
      const delta = keyCode === keyCodes.DOWN ? 1 : -1;
      const y = clamp(initY + delta, 0, maxY);
      return {
        initY: y,
        startX: initX,
        startY: y,
        endY: y,
        endX: initX,
      };
    }

    case keyCodes.RIGHT:
    case keyCodes.LEFT: {
      const delta = keyCode === keyCodes.RIGHT ? 1 : -1;
      const x = clamp(initX + delta, 0, maxX);
      return {
        initX: x,
        startX: x,
        startY: initY,
        endX: x,
        endY: initY,
      };
    }

    default:
      return prevSelection;
  }
};

export const selectionByShiftKey = (keyCode, maxX, maxY, prevSelection) => {
  const { initX, initY, startX, startY, endX, endY } = prevSelection;
  switch (keyCode) {
    case keyCodes.DOWN: {
      const key = initY > startY ? 'startY' : 'endY';
      return {
        ...prevSelection,
        [key]: clamp(prevSelection[key] + 1, 0, maxY),
      };
    }

    case keyCodes.LEFT: {
      const key = endX > initX ? 'endX' : 'startX';
      return {
        ...prevSelection,
        [key]: clamp(prevSelection[key] - 1, 0, maxX),
      };
    }

    case keyCodes.RIGHT: {
      const key = initX > startX ? 'startX' : 'endX';
      return {
        ...prevSelection,
        [key]: clamp(prevSelection[key] + 1, 0, maxX),
      };
    }

    case keyCodes.UP: {
      const key = endY > initY ? 'endY' : 'startY';
      return {
        ...prevSelection,
        [key]: clamp(prevSelection[key] - 1, 0, maxY),
      };
    }

    default:
      return prevSelection;
  }
};

const scrollByKeyDown = (prevScroll, rowsCount, selection, sheetDimensions) => {
  const { firstRowIndex, firstRowOffset } = prevScroll;
  const { initY, startY, endY } = selection;
  const { rowHeight, sheetHeight } = sheetDimensions;
  const bottomBoundary = initY > startY ? startY : endY;
  const lastRowIndex =
    firstRowIndex + Math.floor((sheetHeight - firstRowOffset) / rowHeight) - 1;

  if (lastRowIndex > bottomBoundary) {
    return prevScroll;
  }

  const deltaY =
    (bottomBoundary - lastRowIndex + 1) * rowHeight + firstRowOffset;
  return scrollByDelta(0, deltaY, rowsCount, prevScroll, sheetDimensions);
};

const scrollByKeyLeft = (prevScroll, selection, sheetDimensions) => {
  const { initX, startX, endX } = selection;
  const { columnLefts } = sheetDimensions;
  const leftBoundary = endX > initX ? endX : startX;

  const scrollX = Math.min(columnLefts[leftBoundary], prevScroll.scrollX);
  return { ...prevScroll, scrollX };
};

const scrollByKeyRight = (prevScroll, selection, sheetDimensions) => {
  const { initX, startX, endX } = selection;
  const { columnLefts, sheetWidth } = sheetDimensions;
  const rightBoundary = initX > startX ? startX : endX;

  const scrollX = Math.max(
    columnLefts[rightBoundary] + 100 - sheetWidth,
    prevScroll.scrollX,
  );

  return { ...prevScroll, scrollX };
};

const scrollByKeyUp = (prevScroll, rowsCount, selection, sheetDimensions) => {
  const { firstRowIndex, firstRowOffset } = prevScroll;
  const { initY, startY, endY } = selection;
  const topBoundary = endY > initY ? endY : startY;

  if (firstRowIndex < topBoundary) {
    return prevScroll;
  }

  const { rowHeight } = sheetDimensions;
  const deltaY = (firstRowIndex - topBoundary) * rowHeight - firstRowOffset;
  return scrollByDelta(0, -deltaY, rowsCount, prevScroll, sheetDimensions);
};

export const scrollByKey = (
  keyCode,
  prevScroll,
  rowsCount,
  selection,
  sheetDimensions,
) => {
  switch (keyCode) {
    case keyCodes.DOWN:
      return scrollByKeyDown(prevScroll, rowsCount, selection, sheetDimensions);

    case keyCodes.LEFT:
      return scrollByKeyLeft(prevScroll, selection, sheetDimensions);

    case keyCodes.RIGHT:
      return scrollByKeyRight(prevScroll, selection, sheetDimensions);

    case keyCodes.UP:
      return scrollByKeyUp(prevScroll, rowsCount, selection, sheetDimensions);

    default:
      return prevScroll;
  }
};

export const copyString = (columns, rows, selection) => {
  const startX = Math.max(selection.startX, 0);
  const startY = Math.max(selection.startY, 0);
  const endX = Math.min(selection.endX, columns.length - 1);
  const endY = Math.min(selection.endY, rows.length - 1);

  let result = '';
  for (let x = startX; x <= endX; x += 1) {
    result += `${columns[x].name}${x === endX ? '\n' : ','}`;
  }

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      result += `${rows[y][x]}${x === endX ? '\n' : ','}`;
    }
  }

  return result;
};

const firstRightColumn = (right) => {
  const keys = Object.keys(right).map((key) => Number(key));
  if (keys.length) {
    return Math.min(...keys);
  }

  return null;
};

const lastLeftColumn = (left) => {
  const keys = Object.keys(left).map((key) => Number(key));
  if (keys.length) {
    return Math.max(...keys);
  }

  return null;
};

const lockedColumnsLeft = (columnLefts, columns, lockedArr, scrollX) => {
  const leftBoundary = scrollX;
  const result = {};
  let offset = 0;

  for (let i = 0; i < lockedArr.length; i += 1) {
    const index = lockedArr[i];
    const columnLeft = columnLefts[index];
    const { width } = columns[index];

    if (columnLeft < leftBoundary + offset) {
      result[index] = offset + scrollX;
      offset += width;
    } else {
      return result;
    }
  }

  return result;
};

const lockedColumnsRight = (
  columnLefts,
  columns,
  lockedArr,
  scrollX,
  sheetWidth,
) => {
  const rightBoundary = scrollX + sheetWidth;
  const result = {};
  let offset = 0;

  for (let i = lockedArr.length - 1; i >= 0; i -= 1) {
    const index = lockedArr[i];
    const columnLeft = columnLefts[index];
    const { width } = columns[index];

    if (columnLeft + width > rightBoundary - offset) {
      offset += width;
      result[index] = sheetWidth - offset + scrollX;
    } else {
      return result;
    }
  }

  return result;
};

export const lockedColumns = (columns, locked, scroll, sheetDimensions) => {
  const { scrollX } = scroll;
  const { columnLefts, sheetWidth } = sheetDimensions;

  const lockedArr = Object.keys(locked)
    .filter((index) => locked[index])
    .sort((a, b) => a - b);

  const left = lockedColumnsLeft(columnLefts, columns, lockedArr, scrollX);
  const right = lockedColumnsRight(
    columnLefts,
    columns,
    lockedArr,
    scrollX,
    sheetWidth,
  );

  return {
    firstRightColumn: firstRightColumn(right),
    lastLeftColumn: lastLeftColumn(left),
    lockedColumnsMap: {
      ...left,
      ...right,
    },
  };
};
