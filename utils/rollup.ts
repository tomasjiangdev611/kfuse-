/**
 * Get the second given a rollup
 * @param rollup string
 * @returns number
 * @example 1s -> 1
 * @example 10s -> 10
 * @example 1m -> 60
 * @example 3m -> 600
 */
export const getRollupToSecond = (rollup: string): number => {
  const splitRollup = rollup.split('');
  let unit = '';
  if (rollup.includes('ms')) {
    unit = 'ms';
    splitRollup.pop();
    splitRollup.pop();
  } else {
    unit = splitRollup.pop();
  }
  const multiplier = getRollupUnitMultiplier(unit);
  return Number(splitRollup.join('')) * multiplier;
};

/**
 *
 * @param rollup string
 * @returns string
 * @example 1000ms -> 1s
 * @example 1000s -> 1m
 * @example 120000ms -> 2m
 * @example 120000s -> 2h
 * @example 120000m -> 2d
 */
export const getRollupToMinute = (rollup: string): string => {
  const second = getRollupToSecond(rollup);

  if (second < 1) return `${second * 1000}ms`;

  return second < 60 ? `${second}s` : `${Math.round(second / 60)}m`;
};

export const getRollupUnitMultiplier = (unit: string): number => {
  if (unit === 'ms') return 0.001;
  if (unit === 's') return 1;
  if (unit === 'm') return 60;
  if (unit === 'h') return 3600;
  if (unit === 'd') return 86400;
  if (unit === 'w') return 604800;
  if (unit === 'M') return 2592000;
  if (unit === 'y') return 31536000;
  return 1;
};
