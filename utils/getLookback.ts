import { DateSelection } from 'types';

const queryRangeTimeDuration = (date: DateSelection): number => {
  const { startTimeUnix, endTimeUnix } = date;
  const secondsFromNow = endTimeUnix - startTimeUnix;
  // less than 1 hour
  if (secondsFromNow < 60 * 60) {
    return 30;
  }
  // less than 4 hours
  if (secondsFromNow < 60 * 60 * 4) {
    return 60;
  }
  // less than 1 day
  if (secondsFromNow < 60 * 60 * 24) {
    return 60 * 5;
  }
  // less than 2 days
  if (secondsFromNow < 60 * 60 * 24 * 2) {
    return 60 * 10;
  }
  // less than 1 week
  if (secondsFromNow < 60 * 60 * 24 * 7) {
    return 60 * 60;
  }
  // less than 1 month
  if (secondsFromNow < 60 * 60 * 24 * 30) {
    return 60 * 60 * 2;
  }
  // less than 1 year
  if (secondsFromNow < 60 * 60 * 24 * 365) {
    return 60 * 60 * 24;
  }
};

export default queryRangeTimeDuration;
