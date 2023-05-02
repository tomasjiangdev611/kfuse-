import dayjs, { OpUnitType } from 'dayjs';
import { DateSelection } from 'types/DateSelection';

/**
 * Validated codified string like now-1h
 * @param value string
 * Valid codified string: now, now-1s, now-100m, now-9h, now-17d, now-1w, now-1M, now-1y
 * Invalid codified string: now-1, now-1s1, now-1m1, now-1h1, now-1d1, now-1w1, now-1M1, now-1y1
 */
export const validateCodifiedDate = (value: string): boolean => {
  if (value === 'now') {
    return true;
  }
  const codifiedDateRegex = /^now-(\d+)([smhdwMy])$/;
  return codifiedDateRegex.test(value);
};

/**
 * Validate codified string like now+1h
 * Valid - now+1s, now+100m, now+9h, now+17d, now+1w, now+1M, now+1y
 * Invalid - now+1, now+1h+1d, now+1w+1m, now+1y+1m
 */
export const validateCodifiedDatePlus = (value: string): boolean => {
  const codifiedDateRegex = /^now\+(\d+)([smhdwMy])$/;
  return codifiedDateRegex.test(value);
};

/**
 * Codified string to time converter
 * Unit - seconds, minutes, hours, days, weeks, months, years
 * now - current time
 * Valid - now-1s, now-100m, now-9h, now-17d, now-1w, now-1M, now-1y
 * Invalid - now-1, now-1h-1d, now-1w-1m, now-1y-1m
 * @param value string
 * @returns number unix timestamp
 */
export const convertTimeStringToUnix = (
  value: string,
  utcTimeEnabled?: boolean,
): number => {
  if (value === 'now') {
    return dayjs().unix();
  }
  if (validateCodifiedDate(value)) {
    const [, time, unit] = value.match(/^now-([0-9]+)([smhdwMy])$/);
    if (utcTimeEnabled) {
      return dayjs
        .utc()
        .subtract(parseInt(time, 10), unit as OpUnitType)
        .unix();
    }

    const localDate = dayjs()
      .subtract(parseInt(time, 10), unit as OpUnitType)
      .unix();

    if (
      parseInt(time) > 1 &&
      ['d', 'w', 'M', 'y'].includes(unit) &&
      isDayLightSavingTime(localDate)
    ) {
      return dayjs.unix(localDate).subtract(1, 'h').unix();
    }

    return localDate;
  }
  return null;
};

/**
 * Check if the time is day light saving time
 * @param time unix timestamp
 * @returns boolean
 */
export const isDayLightSavingTime = (time: number): boolean => {
  const date = new Date(time * 1000);
  return date.getTimezoneOffset() > new Date().getTimezoneOffset();
};

/**
 * Codified string to time converter for upcomming time
 * Unit - seconds, minutes, hours, days, weeks, months, years
 * now - current time
 * Valid - now+1s, now+100m, now+9h, now+17d, now+1w, now+1M, now+1y
 * Invalid - now+1, now+1h+1d, now+1w+1m, now+1y+1m
 * @param value string
 * @returns number unix timestamp
 */
export const convertTimeStringToUnixUpcoming = (
  value: string,
  utcTimeEnabled?: boolean,
): number => {
  if (value === 'now') {
    return dayjs().unix();
  }
  if (validateCodifiedDatePlus(value)) {
    const [, time, unit] = value.match(/^now\+([0-9]+)([smhdwMy])$/);

    if (utcTimeEnabled) {
      return dayjs
        .utc()
        .add(parseInt(time, 10), unit as OpUnitType)
        .unix();
    }

    return dayjs()
      .add(parseInt(time, 10), unit as OpUnitType)
      .unix();
  }
  return null;
};

export const convertTimestampToCode = (
  date: DateSelection,
): { from: string; to: string } => {
  const { startLabel, endLabel, startTimeUnix, endTimeUnix } = date;

  if (startLabel && endLabel) {
    return { from: startLabel, to: endLabel };
  }

  // diff in start and end time in minutes
  const diff = Math.round(endTimeUnix - startTimeUnix);
  // diff in end time and now in minutes
  const diffNow = Math.round(dayjs().unix() - endTimeUnix);

  return { from: convertSecondToCode(diff), to: convertSecondToCode(diffNow) };
};

/**
 * Convert codified string to unix timestamp
 * @param diff number
 * @returns string
 * 1 - 59 seconds - now-1s
 * 1 - 59 minutes - now-1m
 * 60 - 1439 minutes - now-1h
 * 1440 - 10079 minutes - now-1d
 * 10080 - 40319 minutes - now-1w
 * 40320 - 525599 minutes - now-1M
 */
const convertSecondToCode = (diff: number): string => {
  if (diff === 0) {
    return 'now';
  }
  if (diff < 60) {
    return `now-${diff}s`;
  }
  if (diff < 1440) {
    return `now-${Math.round(diff / 60)}m`;
  }
  if (diff < 10080) {
    return `now-${Math.round(diff / 1440)}h`;
  }
  if (diff < 40320) {
    return `now-${Math.round(diff / 10080)}d`;
  }
  if (diff < 525600) {
    return `now-${Math.round(diff / 40320)}w`;
  }
  return `now-${Math.round(diff / 525600)}M`;
};

export const convertSecondToTimeString = (diff: number): string => {
  return convertSecondToCode(diff).replace('now-', '');
};

export const convertFromAndToDate = (
  from: number,
  to: number,
): DateSelection => {
  const endTimeUnix = dayjs().subtract(to, 'seconds').unix();
  const startTimeUnix = dayjs().subtract(from, 'seconds').unix();

  const { from: startLabel, to: endLabel } = convertTimestampToCode({
    startTimeUnix,
    endTimeUnix,
  });

  return { startTimeUnix, endTimeUnix, startLabel, endLabel };
};

export const getDateFromCodexRange = (
  from: string,
  to: string,
): DateSelection => {
  if (validateCodifiedDate(from) && validateCodifiedDate(to)) {
    const startTimeUnix = convertTimeStringToUnix(from);
    const endTimeUnix = convertTimeStringToUnix(to);

    return { startTimeUnix, endTimeUnix, startLabel: from, endLabel: to };
  }

  if (
    new Date(from).toString() !== 'Invalid Date' &&
    new Date(to).toString() !== 'Invalid Date'
  ) {
    return {
      startTimeUnix: dayjs(from).unix(),
      endTimeUnix: dayjs(to).unix(),
      startLabel: from,
      endLabel: to,
    };
  }

  return {
    startTimeUnix: convertTimeStringToUnix('now-5m'),
    endTimeUnix: convertTimeStringToUnix('now'),
    startLabel: 'now-5m',
    endLabel: 'now',
  };
};

/**
 * Convert seconds to date
 * @param from
 * @param to
 * @returns
 * @example { from: 300, to: 0 } -> { startTimeUnix: 1625580000, endTimeUnix: 1625580300, startLabel: 'now-5m', endLabel: 'now' }
 */
export const getDateFromSecondRange = (
  from: number,
  to: number,
): DateSelection => {
  const endTimeUnix = dayjs().subtract(to, 'seconds').unix();
  const startTimeUnix = dayjs().subtract(from, 'seconds').unix();

  const { from: startLabel, to: endLabel } = convertTimestampToCode({
    startTimeUnix,
    endTimeUnix,
  });

  return { startTimeUnix, endTimeUnix, startLabel, endLabel };
};
