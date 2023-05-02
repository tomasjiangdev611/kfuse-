import { DateSelection } from 'types';

const calcAutoRollUpInSeconds = (date: DateSelection): number => {
  const { startTimeUnix, endTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;

  if (diffInSeconds >= 60 * 60 * 24) {
    return 60 * 20;
  }

  if (diffInSeconds >= 60 * 60 * 4) {
    return 60 * 4;
  }

  if (diffInSeconds >= 60 * 60) {
    return 60;
  }

  if (diffInSeconds >= 60 * 30) {
    return 30;
  }

  if (diffInSeconds >= 60 * 15) {
    return 10;
  }

  if (diffInSeconds >= 60 * 5) {
    return 5;
  }

  return 1;
};

export default calcAutoRollUpInSeconds;
