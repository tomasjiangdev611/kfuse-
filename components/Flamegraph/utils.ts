import * as constants from './constants';

export const clampScale = (nextScale: number): number =>
  Math.min(Math.max(nextScale, constants.MIN_SCALE), constants.MAX_SCALE);
