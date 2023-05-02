import dayjs from 'dayjs';
import { convertNumberToReadableUnit, findUnitCategoryFormatById } from 'utils';

/**
 * convert bytes to human readable format
 * @param bytes
 * @example bytesToSize(8) => 1 Byte
 * @example bytesToSize(1024) => 1 KB
 * @example bytesToSize(1024*1024) => 1 MB
 * @example bytesToSize(1024*1024*1024) => 1 GB
 */
export const bytesToSize = (bit: number): string => {
  const sizes = ['Byte', 'KB', 'MB', 'GB', 'TB'];
  if (bit === 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bit) / Math.log(1024));
  return Math.round(bit / Math.pow(1024, i)) + ' ' + sizes[i];
};

/**
 * convert duration to human readable format
 * @param duration
 * @example durationToSize(1) => 1s
 * @example durationToSize(1*60) => 1m
 * @example durationToSize(1*60*60) => 1h
 * @example durationToSize(1*60*60*24) => 1d
 * @example durationToSize(1*60*60*24*7) => 1w
 * @example durationToSize(1*60*60*24*7*30) => 1mo
 * @example durationToSize(1*60*60*24*7*30*12) => 1y
 */
export const durationToSize = (duration: number): string => {
  if (duration === 0) {
    return '0s';
  }

  if (duration < 1) {
    return duration + 's';
  }

  if (duration < 60) {
    return duration + 's';
  }

  if (duration < 60 * 60) {
    return Math.round(duration / 60) + 'm';
  }

  if (duration < 60 * 60 * 24) {
    return Math.round(duration / (60 * 60)) + 'h';
  }

  if (duration < 60 * 60 * 24 * 7) {
    return Math.round(duration / (60 * 60 * 24)) + 'd';
  }

  if (duration < 60 * 60 * 24 * 7 * 30) {
    return Math.round(duration / (60 * 60 * 24 * 7)) + 'w';
  }

  if (duration < 60 * 60 * 24 * 7 * 30 * 12) {
    return Math.round(duration / (60 * 60 * 24 * 7 * 30)) + 'mo';
  }
};

/**
 * Convert unix timestamp to human readable format
 * @param timestamp
 * @example time diff less than 5 minutes => 9:30:20 am
 * @example time diff less than 1 houes => 9:30 am
 */
export const convertToReadableTime = (vals: Array<number>): string[] => {
  const firstTimestamp = vals[0];
  const lastTimestamp = vals[vals.length - 1];
  const timeDiff = lastTimestamp - firstTimestamp;

  return vals.map((timestamp) => {
    const time = dayjs.unix(timestamp);
    if (timeDiff < 60 * 60) {
      if (time.format('ss') === '00') {
        return time.format('HH:mm');
      }
      return null;
    } else if (timeDiff < 60 * 60 * 24) {
      return time.format('HH:mm');
    } else if (timeDiff < 60 * 60 * 24 * 10) {
      if (time.format('HH:mm') === '00:00') {
        return time.format('MMM D');
      }
      return time.format('HH:mm');
    } else {
      return time.format('MMM D');
    }
  });
};

export const formatYAxis = (vals: Array<number>, unit: string): string[] => {
  if (unit === 'number' || unit === 'count') {
    const valLength = vals.length - 1;
    if (vals[valLength] < 1 && vals[valLength] > 0) {
      const decimalFormat = findUnitCategoryFormatById('none');
      return vals.map((v) => decimalFormat.fn(v).text);
    }

    return vals.map((v) => convertNumberToReadableUnit(v, 2));
  }

  const unitFormat = findUnitCategoryFormatById(unit);
  if (unitFormat) {
    return vals.map((v) => {
      const { prefix, suffix, text } = unitFormat.fn(v);
      return `${prefix || ''}${text}${suffix || ''}`;
    });
  }

  return vals.map((v) => convertNumberToReadableUnit(v, 2));
};

export const tooltipFormatter = (vals: any, unit: string): string => {
  if (!vals) return '0';

  const valNumber = Number(vals);
  if (Number.isNaN(valNumber)) {
    return vals;
  }

  if (unit === 'number' || unit === 'count') {
    if (valNumber < 1 && valNumber > 0) {
      const decimalFormat = findUnitCategoryFormatById('none');
      return decimalFormat.fn(valNumber).text;
    }
    return convertNumberToReadableUnit(valNumber, 3);
  }

  const unitFormat = findUnitCategoryFormatById(unit);
  if (unitFormat) {
    const { prefix, suffix, text } = unitFormat.fn(valNumber);
    return `${prefix || ''}${text}${suffix || ''}`;
  }

  return convertNumberToReadableUnit(valNumber, 3);
};
