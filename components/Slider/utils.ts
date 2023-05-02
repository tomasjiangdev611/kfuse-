export const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

export const calcSliderPercentage = (value, min, max) =>
  clamp(((value - min) / (max - min)) * 100, 0, 100);
