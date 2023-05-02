import { DateSelection } from 'types';

export const queryRangeTimeDuration = (date: DateSelection): number => {
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

  return 60;
};

const pixelsPerBar = 10;
const scrapeInterval = 30 * 1000;

type Args = {
  date: DateSelection;
  instant?: boolean;
  width: number;
};

type RateIntervalAndStep = {
  rateInterval: string;
  stepInMs: number;
};

export const getInstantRateIntervalAndStep = ({
  date,
}: {
  date: DateSelection;
}): RateIntervalAndStep => {
  const { startTimeUnix, endTimeUnix } = date;
  const totalInSeconds = endTimeUnix - startTimeUnix;
  return {
    rateInterval: `${4 * scrapeInterval}ms`,
    stepInMs: totalInSeconds * 1000,
  };
};

export const getRateIntervalAndStep = ({
  date,
  width,
}: Args): RateIntervalAndStep => {
  const { startTimeUnix, endTimeUnix } = date;
  const totalInSeconds = endTimeUnix - startTimeUnix;
  const numberOfBars = Math.round(width / pixelsPerBar);

  const secondsPerBar = Math.round(totalInSeconds / numberOfBars);
  const stepInMs = secondsPerBar * 1000;
  const rateInterval = Math.max(stepInMs + scrapeInterval, 4 * scrapeInterval);

  return {
    rateInterval: `${rateInterval}ms`,
    stepInMs,
  };
};

/**
 * Get metric period
 * @param startTimeUnix: number
 * @param endTimeUnix: number
 * @type: string
 * @returns number
 */
export const queryRangeTimeDurationV2 = (
  startTimeUnix: number,
  endTimeUnix: number,
): number => {
  const secondsFromNow = endTimeUnix - startTimeUnix;
  // less than 1 hour
  if (secondsFromNow < 60 * 60) {
    return 20;
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

  return 20;
};
