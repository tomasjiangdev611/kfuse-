import uPlot, { Axis, Cursor, Series } from 'uplot';
import { ChartRenderProps, TooltipCoordsProps } from 'components/Chart/types';

export const calculateTooltipPosition = (
  xPos = 0,
  yPos = 0,
  tooltipWidth = 0,
  tooltipHeight = 0,
  xOffset = 0,
  yOffset = 0,
  windowWidth = 0,
  windowHeight = 0,
): { x: number; y: number } => {
  let x = xPos;
  let y = yPos;

  const overflowRight = Math.max(
    xPos + xOffset + tooltipWidth - (windowWidth - xOffset),
    0,
  );
  const overflowLeft = Math.abs(
    Math.min(xPos - xOffset - tooltipWidth - xOffset, 0),
  );
  const wouldOverflowRight = overflowRight > 0;
  const wouldOverflowLeft = overflowLeft > 0;

  const overflowBelow = Math.max(
    yPos + yOffset + tooltipHeight - (windowHeight - yOffset),
    0,
  );
  const overflowAbove = Math.abs(
    Math.min(yPos - yOffset - tooltipHeight - yOffset, 0),
  );
  const wouldOverflowBelow = overflowBelow > 0;
  const wouldOverflowAbove = overflowAbove > 0;

  if (wouldOverflowRight && wouldOverflowLeft) {
    x =
      overflowRight > overflowLeft
        ? xOffset
        : windowWidth - xOffset - tooltipWidth;
  } else if (wouldOverflowRight) {
    x = xPos - xOffset - tooltipWidth;
  } else {
    x = xPos + xOffset;
  }

  if (wouldOverflowBelow && wouldOverflowAbove) {
    y =
      overflowBelow > overflowAbove
        ? yOffset
        : windowHeight - yOffset - tooltipHeight;
  } else if (wouldOverflowBelow) {
    y = yPos - yOffset - tooltipHeight;
  } else {
    y = yPos + yOffset;
  }
  return { x, y };
};

export const isCursorOutsideCanvas = (
  { left, top }: uPlot.Cursor,
  canvas: DOMRect,
): boolean => {
  if (left === undefined || top === undefined) {
    return false;
  }
  return left < 0 || left > canvas.width || top < 0 || top > canvas.height;
};

/**
 * Given uPlot cursor position, figure out position of the tooltip withing the canvas bbox
 * Tooltip is positioned relatively to a viewport
 * @internal
 **/
export const positionTooltip = (
  u: uPlot,
  bbox: DOMRect,
): { x: number; y: number } => {
  let x, y;
  const cL = u.cursor.left || 0;
  const cT = u.cursor.top || 0;

  if (isCursorOutsideCanvas(u.cursor, bbox)) {
    const idx = u.posToIdx(cL);
    // when cursor outside of uPlot's canvas
    if (cT < 0 || cT > bbox.height) {
      const pos = findMidPointYPosition(u, idx);

      if (pos) {
        y = bbox.top + pos;
        if (cL >= 0 && cL <= bbox.width) {
          // find x-scale position for a current cursor left position
          x =
            bbox.left +
            u.valToPos(u.data[0][u.posToIdx(cL)], u.series[0].scale!);
        }
      }
    }
  } else {
    x = bbox.left + cL;
    y = bbox.top + cT;
  }

  return { x, y };
};

export const findMidPointYPosition = (u: uPlot, idx: number): number => {
  let y;
  let sMaxIdx = 1;
  let sMinIdx = 1;
  // assume min/max being values of 1st series
  let max = u.data[1][idx];
  let min = u.data[1][idx];

  // find min max values AND ids of the corresponding series to get the scales
  for (let i = 1; i < u.data.length; i++) {
    const sData = u.data[i];
    const sVal = sData[idx];
    if (sVal != null) {
      if (max == null) {
        max = sVal;
      } else {
        if (sVal > max) {
          max = u.data[i][idx];
          sMaxIdx = i;
        }
      }
      if (min == null) {
        min = sVal;
      } else {
        if (sVal < min) {
          min = u.data[i][idx];
          sMinIdx = i;
        }
      }
    }
  }

  if (min == null && max == null) {
    // no tooltip to show
    y = undefined;
  } else if (min != null && max != null) {
    // find median position
    y =
      (u.valToPos(min, u.series[sMinIdx].scale!) +
        u.valToPos(max, u.series[sMaxIdx].scale!)) /
      2;
  } else {
    // snap tooltip to min OR max point, one of those is not null :)
    y = u.valToPos((min || max)!, u.series[(sMaxIdx || sMinIdx)!].scale!);
  }

  // if y is out of canvas bounds, snap it to the bottom
  if (y !== undefined && y < 0) {
    y = u.bbox.height / devicePixelRatio;
  }

  return y;
};

export const getLabelFromSeries = (
  series: Series[],
  seriesIndex: number,
): string => {
  if (!series || !series[seriesIndex]) return '';
  return series[seriesIndex].label;
};

export const getLabelColor = (
  series: Series[],
  seriesIndex: number,
): Series.Stroke => {
  if (!series || !series[seriesIndex]) return null;

  if (series[seriesIndex].stroke) {
    return series[seriesIndex].stroke;
  }

  return series[seriesIndex].fill;
};

export const getCursorValue = (
  data: Array<any>,
  seriesIndex: number,
  idx: number,
): string => {
  return data[seriesIndex][idx];
};

export const getCursorTimestamp = (data: Array<any>, idx: number): number => {
  return data[0][idx];
};

export const positionTooltipCompact = (
  { cursorLeft, cursorTop }: { cursorLeft: number; cursorTop: number },
  { width, height }: { width: number; height: number },
): { x: number; y: number } => {
  const TOP_OFFSET = 24;
  const LEFT_OFFSET = 80;
  if (cursorLeft < 0 || cursorTop < 0) {
    return { x: undefined, y: undefined };
  }

  // if cursor is outside of the canvas, return null
  if (cursorLeft > width || cursorTop > height) {
    return null;
  }

  const left = cursorLeft + LEFT_OFFSET;
  const top = cursorTop + TOP_OFFSET;

  return { x: left, y: top };
};

export const tooltipCursorCompact = (
  coords: { x: number; y: number },
  height: number,
  width: number,
): TooltipCoordsProps => {
  if (!coords) {
    return null;
  }

  let position: TooltipCoordsProps['position'] = 'left';
  if (coords.x < width / 2) {
    position = 'right';
  }

  const left = coords.x;
  let top = coords.y;
  if (height - coords.y < 50) {
    top = coords.y - 40;
  }

  return { x: left, y: top, position };
};

export const tooltipCursorViewport = (
  domRect: DOMRect,
  axis: Axis,
  cursor: Cursor,
  layoutType: ChartRenderProps['layoutType'],
): TooltipCoordsProps => {
  const TOP_OFFSET = 36;
  const PADDING_OFFSET = 16;
  const { left: cLeft, top: cTop } = cursor;

  // if cursor is outside of the canvas, return null
  if (cLeft < 0 || cTop < 0) {
    return { x: undefined, y: undefined, position: 'left' };
  }

  // if window/2 is greater than the cursor position, position the tooltip to the right
  const position =
    window.innerWidth / 2 > cLeft + domRect.left ? 'right' : 'left';

  let cursorLeft = cLeft + PADDING_OFFSET;
  let cursorTop = cTop + PADDING_OFFSET;

  if (layoutType === 'explore') {
    cursorTop = cursorTop + domRect.top;
    cursorLeft = cursorLeft + domRect.left - PADDING_OFFSET / 2;
  }

  if (layoutType === 'dashboard') {
    cursorTop = cursorTop + TOP_OFFSET + PADDING_OFFSET / 4;
    cursorLeft = cursorLeft + axis.size - PADDING_OFFSET / 4;

    if (position === 'right') {
      cursorLeft = cursorLeft + PADDING_OFFSET / 4;
    }
  }

  return { x: cursorLeft, y: cursorTop, position };
};

export const getBarSeriesIdx = (u: uPlot): number => {
  const pointIdx = u.posToIdx(u.cursor.left);
  const height = u.bbox.height / devicePixelRatio;
  const cursorTop = height - u.cursor.top;

  const posRange: { min: number; max: number; seriesIdx: number }[] = [];
  for (let i = 0; i < u.series.length; i++) {
    const series = u.series[i];

    if (series.show && series.paths) {
      const point = u.data[i][pointIdx];
      const y = height - u.valToPos(point, 'y');
      if (posRange.length === 0) {
        posRange.push({ min: 0, max: y, seriesIdx: i });
      } else {
        posRange.push({
          min: posRange[posRange.length - 1].max,
          max: y,
          seriesIdx: i,
        });
      }
    }

    if (i === u.series.length - 1) {
      posRange.push({
        min: posRange[posRange.length - 1].max,
        max: height,
        seriesIdx: null,
      });
    }
  }

  if (posRange.length === 0) {
    return null;
  }

  for (let i = 0; i < posRange.length; i++) {
    const range = posRange[i];
    if (cursorTop > range.min && cursorTop < range.max) {
      return range.seriesIdx;
    }
  }

  return null;
};
