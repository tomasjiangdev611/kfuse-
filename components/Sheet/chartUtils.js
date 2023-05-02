import * as chartTypes from './chartTypes';
import { createScale } from './scaleUtils';

export const calcPixelRatio = ctx => {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStorePixelRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return devicePixelRatio / backingStorePixelRatio;
};

export const pointToCanvasY = (pointY, yMin, yMax, height) =>
  (1 - (pointY - yMin) / (yMax - yMin)) * height;

export const selectionToCharts = (rows, selection) => {
  const rowsLen = rows.length;
  const { startX, startY, endX, endY } = selection;

  if (startX === null || startY === null || endX === null || endY === null) {
    return [];
  }

  const charts = [];

  for (let x = startX; x <= endX; x += 1) {
    let yMin = 0;
    let yMax = 0;
    const points = [];

    for (let y = startY; y <= endY; y += 1) {
      if (y >= 0 && y < rowsLen) {
        const point = rows[y][x];

        if (point < yMin) {
          yMin = point;
        }

        if (point > yMax) {
          yMax = point;
        }

        points.push(point);
      }
    }

    charts.push({
      datasets: [
        {
          color: '#3381b7',
          points,
          type: chartTypes.LINE,
        },
      ],
      key: x,
      scaleY: createScale(yMin, yMax, 3),
    });
  }

  return charts;
};
