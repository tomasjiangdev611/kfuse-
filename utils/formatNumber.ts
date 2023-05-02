export const formatNumber = (v: any): string => {
  if (typeof v === 'number' && v.toLocaleString) {
    return v.toLocaleString('en-US');
  }

  return v;
};

/**
 * formmat number in readable format
 * @param v
 * @example 12344 -> 12.34K
 * @example 12745 -> 12.74K
 * @example 12345678 -> 12.35M
 * @example 123456789 -> 123.46M
 * @example 1234567890 -> 1.23B
 * @example 12345678901 -> 12.35B
 * @example 123456789012 -> 123.46B
 * @example 1234567890123 -> 1.23T
 */
export const convertNumberToReadableUnit = (v: any, toFixed = 2): string => {
  if (typeof v === 'number') {
    if (v < 1000 && v > -1000) {
      return v.toLocaleString('en-US', { maximumFractionDigits: toFixed });
    }

    const isNegative = v < 0;
    v = Math.abs(v);
    const exp = Math.floor(Math.log(v) / Math.log(1000));
    const unit = ['K', 'M', 'B', 'T'][exp - 1];
    const value = (v / Math.pow(1000, exp)).toFixed(toFixed);

    if (isNegative) {
      return `-${value}${unit}`;
    }
    return `${value}${unit}`;
  }

  return v;
};
