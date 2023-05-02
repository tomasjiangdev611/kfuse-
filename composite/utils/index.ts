import dayjs, { OpUnitType } from 'dayjs';
import { dateTimeFormat } from 'constants';
import { DateSelection } from 'types';
import { formatSecondsToLabel } from 'utils';

export const periodOptions = [
  { label: 'Last 5 minutes', from: 'now-5m', to: 'now' },
  { label: 'Last 15 minutes', from: 'now-15m', to: 'now' },
  { label: 'Last 30 minutes', from: 'now-30m', to: 'now' },
  { label: 'Last Hour', from: 'now-1h', to: 'now' },
  { label: 'Last 3 Hours', from: 'now-3h', to: 'now' },
  { label: 'Last 6 Hours', from: 'now-6h', to: 'now' },
  { label: 'Last 12 Hours', from: 'now-12h', to: 'now' },
  { label: 'Last Day', from: 'now-1d', to: 'now' },
  { label: 'Last 7 Days', from: 'now-7d', to: 'now' },
  { label: 'Live Tail', from: '', to: '' },
];

export const getPeriodOptionLabel = (date: DateSelection): string => {
  const { endLabel, endTimeUnix, startLabel, startTimeUnix } = date;

  if (endLabel === 'now') {
    return `Last ${formatSecondsToLabel(endTimeUnix - startTimeUnix)}`;
  }
  return `${startLabel} to ${endLabel}`;
};

/**
 * Format unix timestamp to human readable time
 * @param unixTimestamp number
 * @returns string
 */
export const formatUnixTimestamp = (
  unixTimestamp: number,
  utcTimeEnabled: boolean,
): string => {
  if (utcTimeEnabled) {
    return dayjs.unix(unixTimestamp).utc(false).format(dateTimeFormat);
  }
  return dayjs.unix(unixTimestamp).format(dateTimeFormat);
};

/**
 * Format date to human readable date and time
 * @param date Date
 * @returns string
 */
export const formatDate = (date: Date, utcTimeEnabled: boolean): string => {
  if (utcTimeEnabled) {
    return dayjs(date).utc(false).format(dateTimeFormat);
  }
  return dayjs(date).format(dateTimeFormat);
};

/**
 * Convert date to unix timestamp
 * @param date Date
 * @returns number
 */
export const convertDateToUnix = (
  date: string,
  utcTimeEnabled?: boolean,
): number =>
  utcTimeEnabled ? dayjs(date).utc(true).unix() : dayjs(date).unix();

/**
 * Validate date with YYYY-MM-DD HH:mm:ss format
 * @param date string
 * @returns boolean
 * @logic
 * time - 00:00:00 to 23:59:59
 * days - 01 to 31
 * months - 01 to 12
 * years - 1900 to 9999
 */
export const validateDate = (date: string): boolean => {
  const dateRegex =
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  return dateRegex.test(date);
};

/**
 * Validate date with YYYY-MM-DD HH:mm:ss format
 * @param value string
 * @returns string
 */
export const validateDateField = (value: string): string => {
  if (validateCodifiedDate(value)) {
    return '';
  }
  switch (true) {
    case validateDate(value) === false:
      return 'Please enter a valid date';
    case value.length === 0:
      return 'Please enter a date';
    default:
      return '';
  }
};

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
 * Get value of a form submit event
 * @param event
 * @param propertyList
 * @returns
 */
export const getValueFromHtmlForm = (
  event: React.FormEvent,
  propertyList: string[],
): any => {
  const formData = new FormData(event.target as HTMLFormElement);
  const result: any = {};
  propertyList.forEach((property) => {
    result[property] = formData.get(property);
  });
  return result;
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
  utcTimeEnabled: boolean,
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
    return dayjs()
      .subtract(parseInt(time, 10), unit as OpUnitType)
      .unix();
  }
  return null;
};
