export const niceNum = (i, shouldRound) => {
  const power = Math.floor(Math.log(i) / Math.LN10);
  const fractional = i / 10 ** power;
  const multiplier = 10 ** power;

  if (shouldRound) {
    if (fractional < 1.5) {
      return multiplier;
    } else if (fractional < 3) {
      return 2 * multiplier;
    } else if (fractional < 7) {
      return 5 * multiplier;
    }

    return 10 * multiplier;
  }

  if (fractional <= 1) {
    return multiplier;
  } else if (fractional <= 2) {
    return 2 * multiplier;
  } else if (fractional <= 5) {
    return 5 * multiplier;
  }

  return 10 * multiplier;
};

const gutter = ticks =>
  Math.max(...ticks.map(tick => tick.toString().length * 8));

const precision = (step, value) => {
  const multiplier = 10 ** (Math.ceil(Math.log10(step)) + 1);
  return Math.round(value * multiplier) / multiplier;
};

const createTicks = (min, numSteps, step) => {
  const result = [];
  for (let i = 0; i <= numSteps; i += 1) {
    result.push(precision(step, min + step * i));
  }

  return result;
};

export const createScale = (min, max, ticksDesired) => {
  const range = niceNum(max - min, false);
  const step = niceNum(range / ticksDesired, true);

  const scaleMin = Math.floor(min / step) * step;
  const scaleMax = Math.ceil(max / step) * step;

  const numSteps = (scaleMax - scaleMin) / step;
  const ticks = createTicks(scaleMin, numSteps, step);

  return {
    gutter: gutter(ticks),
    min: ticks[0],
    max: ticks[ticks.length - 1],
    ticks,
  };
};
