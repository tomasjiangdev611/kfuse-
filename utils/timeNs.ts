import dayjs from 'dayjs';
import { TimeUnit } from 'types';

export const formatNsAsDate = (ns: number) => {
  const unixTimestamp = formatNs(ns, TimeUnit.SECONDS);
  return dayjs.unix(unixTimestamp).format('MMM D HH:mm:ss');
};

export const formatNs = (ns: number, unit: TimeUnit, toFixed = 0) => {
  const value = ns / valueOfUnit(unit);
  if (value % 1 === 0) {
    return Math.floor(value);
  }

  if (
    toFixed &&
    unit !== TimeUnit.MICROSECONDS &&
    unit !== TimeUnit.NANOSECONDS &&
    unit !== TimeUnit.MILLISECONDS
  ) {
    return value.toFixed(toFixed);
  }

  return Math.round(value);
};

export const valueOfUnit = (unit: TimeUnit): number => {
  switch (unit) {
    case TimeUnit.NANOSECONDS:
      return 1;
    case TimeUnit.MICROSECONDS:
      return 1000;
    case TimeUnit.MILLISECONDS:
      return 1000000;
    case TimeUnit.SECONDS:
      return 1000000000;
    case TimeUnit.MINUTES:
      return 60000000000;
    case TimeUnit.HOURS:
      return 3600000000000;
    default:
      return 0;
  }
};

export const getUnit = (
  diffInNs: number,
  thresholdMultiplier = 3,
): TimeUnit => {
  const units = [
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
    TimeUnit.MICROSECONDS,
  ];

  for (let i = 0; i < units.length; i += 1) {
    const unit = units[i];
    if (diffInNs > thresholdMultiplier * valueOfUnit(unit)) {
      return unit;
    }
  }

  return TimeUnit.NANOSECONDS;
};

export const formatDurationNs = (
  duration: number,
  thresholdMultiplier = 3,
  toFixed = 0,
): string => {
  const unit = getUnit(duration, thresholdMultiplier);
  return `${formatNs(duration, unit, toFixed)}${unit}`;
};

export const formatDiffNs = (
  startTimeNs: number,
  endTimeNs: number,
): string => {
  const diffInNs = endTimeNs - startTimeNs;
  const unit = getUnit(diffInNs);
  return `${formatNs(diffInNs, unit)}${unit}`;
};

export const duration = (startTimeNs: number, endTimeNs: number): string => {
  const diffInNs = endTimeNs - startTimeNs;
  return `${formatNs(diffInNs, TimeUnit.MINUTES)}${TimeUnit.MINUTES}`;
};

export const lastRunDuration = (
  startTimeNs: number,
  endTimeNs: number,
): string => {
  const diffInNs = endTimeNs - startTimeNs;
  const unit = getUnit(diffInNs);
  if (unit == TimeUnit.MINUTES && formatNs(diffInNs, unit) > 60) {
    const hours = Math.floor(formatNs(diffInNs, unit) / 60);
    const minutes = formatNs(diffInNs, unit) % 60;
    return `${hours}h ${minutes}m`;
  }
  return `${formatNs(diffInNs, unit)}${unit}`;
};

export const ageDuration = (startTimeNs: number, endTimeNs: number): string => {
  const diffInNs = endTimeNs - startTimeNs;
  const unit = getUnit(diffInNs);
  if (unit == TimeUnit.MINUTES && formatNs(diffInNs, unit) > 60) {
    const hours = Math.floor(formatNs(diffInNs, unit) / 60);
    const minutes = formatNs(diffInNs, unit) % 60;
    return `${hours}h ${minutes}m`;
  }
  return `${Math.round(formatNs(diffInNs, unit) / 24)}${TimeUnit.HOURS}`;
};

export const ageCalculator = (timestamp: number): string => {
  if (timestamp !== null) {
    const now = Date.now() / 1000;
    const duration = now - timestamp;
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(duration / (60 * 60)) % 24;
    const days = Math.floor(duration / (60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years} years`;
    } else if (months > 0) {
      return `${months} months`;
    } else if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes, and ${seconds} seconds`;
    }
  } else {
    return '-';
  }
};

export const calculateCapacity = (bytes: number) => {
  if (bytes >= 0) {
    if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(2) + ' GB';
    } else {
      return (bytes / 1000000).toFixed(2) + ' MB';
    }
  }
};

export const truncate = (str: string) => {
  return str.length > 10 ? str.substring(0, 7) + '...' : str;
};
