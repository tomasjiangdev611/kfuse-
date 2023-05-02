import * as d3 from 'd3';
import { HostmapDataProps } from './types';

/**
 * calculate the number of columns and rows of hexagons
 * @param count
 * @returns
 */
export const getHexagonColAndRow = (
  count: number,
  height: number,
): { cols: number; rows: number } => {
  if (count === 0) {
    return { cols: 0, rows: 0 };
  }

  if (height < 130) {
    return { cols: count, rows: 1 };
  }

  let cols = 1;
  let rows = 1;
  let hexagonCount = 1;
  while (hexagonCount < count) {
    if (cols === rows) {
      cols++;
    } else {
      rows++;
    }
    hexagonCount = cols * rows + (cols - 1) * (rows - 1);
  }
  return { cols, rows };
};

export const calculateHostmapPoints = (
  data: HostmapDataProps[],
  hostRadius: number,
  cols: number,
  rows: number,
) => {
  const points = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (points.length < hostRadius && data[points.length]) {
        let x = hostRadius * j * 1.75;
        if (i % 2 === 1) x += (hostRadius * Math.sqrt(3)) / 2;
        const y = hostRadius * i * 1.5;
        points.push([x, y, data[points.length]]);
      }
    }
  }
  return points;
};

export const calculateHostmapRadius = (
  cols: number,
  rows: number,
  width: number,
  height: number,
): number => {
  const hexRadius = d3.min([
    width / ((cols + 0.5) * Math.sqrt(3)),
    height / ((rows + 1 / 3) * 1.5),
  ]);

  // cap at min 20 and max 50
  return Math.min(Math.max(hexRadius, 20), 50);
};

/**
 * calculate the size of the label
 * @param radius
 * @returns
 */
export const calculateHostmapLabelSize = (radius: number): number => {
  if (radius < 30) {
    return null;
  }

  const labelSize = radius * 0.3;

  // cap at min 10 and max 20
  return Math.min(Math.max(labelSize, 10), 20);
};
