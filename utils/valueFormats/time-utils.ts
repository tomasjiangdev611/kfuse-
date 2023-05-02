import { toFixed, toFixedScaled } from './symbol-utils';
import { DecimalCount, FormattedValue } from './types';

export function toMilliSeconds(
  size: number,
  decimals?: DecimalCount,
  scaledDecimals?: DecimalCount,
): FormattedValue {
  if (size === null) {
    return { text: '' };
  }

  if (Math.abs(size) < 1000) {
    return { text: toFixed(size, decimals), suffix: ' ms' };
  } else if (Math.abs(size) < 60000) {
    // Less than 1 min
    return toFixedScaled(size / 1000, decimals, ' s');
  } else if (Math.abs(size) < 3600000) {
    // Less than 1 hour, divide in minutes
    return toFixedScaled(size / 60000, decimals, ' min');
  } else if (Math.abs(size) < 86400000) {
    // Less than one day, divide in hours
    return toFixedScaled(size / 3600000, decimals, ' hour');
  } else if (Math.abs(size) < 31536000000) {
    // Less than one year, divide in days
    return toFixedScaled(size / 86400000, decimals, ' day');
  }

  return toFixedScaled(size / 31536000000, decimals, ' year');
}

export function toSeconds(
  size: number,
  decimals?: DecimalCount,
): FormattedValue {
  if (size === null) {
    return { text: '' };
  }

  // If 0, use s unit instead of ns
  if (size === 0) {
    return { text: '0', suffix: ' s' };
  }

  // Less than 1 µs, divide in ns
  if (Math.abs(size) < 0.000001) {
    return toFixedScaled(size * 1e9, decimals, ' ns');
  }
  // Less than 1 ms, divide in µs
  if (Math.abs(size) < 0.001) {
    return toFixedScaled(size * 1e6, decimals, ' µs');
  }
  // Less than 1 second, divide in ms
  if (Math.abs(size) < 1) {
    return toFixedScaled(size * 1e3, decimals, ' ms');
  }

  if (Math.abs(size) < 60) {
    return { text: toFixed(size, decimals), suffix: ' s' };
  } else if (Math.abs(size) < 3600) {
    // Less than 1 hour, divide in minutes
    return toFixedScaled(size / 60, decimals, ' min');
  } else if (Math.abs(size) < 86400) {
    // Less than one day, divide in hours
    return toFixedScaled(size / 3600, decimals, ' hour');
  } else if (Math.abs(size) < 604800) {
    // Less than one week, divide in days
    return toFixedScaled(size / 86400, decimals, ' day');
  } else if (Math.abs(size) < 31536000) {
    // Less than one year, divide in week
    return toFixedScaled(size / 604800, decimals, ' week');
  }

  return toFixedScaled(size / 3.15569e7, decimals, ' year');
}

export function toMinutes(
  size: number,
  decimals?: DecimalCount,
): FormattedValue {
  if (size === null) {
    return { text: '' };
  }

  if (Math.abs(size) < 60) {
    return { text: toFixed(size, decimals), suffix: ' min' };
  } else if (Math.abs(size) < 1440) {
    return toFixedScaled(size / 60, decimals, ' hour');
  } else if (Math.abs(size) < 10080) {
    return toFixedScaled(size / 1440, decimals, ' day');
  } else if (Math.abs(size) < 604800) {
    return toFixedScaled(size / 10080, decimals, ' week');
  } else {
    return toFixedScaled(size / 5.25948e5, decimals, ' year');
  }
}

export function toHours(size: number, decimals?: DecimalCount): FormattedValue {
  if (size === null) {
    return { text: '' };
  }

  if (Math.abs(size) < 24) {
    return { text: toFixed(size, decimals), suffix: ' hour' };
  } else if (Math.abs(size) < 168) {
    return toFixedScaled(size / 24, decimals, ' day');
  } else if (Math.abs(size) < 8760) {
    return toFixedScaled(size / 168, decimals, ' week');
  } else {
    return toFixedScaled(size / 8760, decimals, ' year');
  }
}

export function toDays(size: number, decimals?: DecimalCount): FormattedValue {
  if (size === null) {
    return { text: '' };
  }

  if (Math.abs(size) < 7) {
    return { text: toFixed(size, decimals), suffix: ' day' };
  } else if (Math.abs(size) < 365) {
    return toFixedScaled(size / 7, decimals, ' week');
  } else {
    return toFixedScaled(size / 365, decimals, ' year');
  }
}
