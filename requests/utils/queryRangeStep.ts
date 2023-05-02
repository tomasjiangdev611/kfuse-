import { DateSelection } from 'types';

const queryRangeStep = (date: DateSelection): number => {
  const { startTimeUnix, endTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;
  if (diffInSeconds > 60 * 60 * 24 * 30) {
    return 60 * 60 * 24;
  }

  if (diffInSeconds > 60 * 60 * 24 * 7) {
    return 60 * 60 * 2;
  }

  if (diffInSeconds > 60 * 60 * 24 * 2) {
    return 60 * 60;
  }

  if (diffInSeconds > 60 * 60 * 24) {
    return 60 * 10;
  }

  if (diffInSeconds > 60 * 60 * 2) {
    return 60 * 5;
  }

  if (diffInSeconds > 60 * 60) {
    return 60;
  }

  if (diffInSeconds > 60 * 30) {
    return 30;
  }

  return 15;
};

export default queryRangeStep;
