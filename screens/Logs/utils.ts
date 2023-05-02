import { delimiter } from 'constants';
import { formatFacetName } from 'requests/utils';

export const getBarCount = (width) => Math.ceil(width / 4) + 1;

export const getBucketSecs = (date, width) => {
  const { endTimeUnix, startTimeUnix } = date;
  const barCount = getBarCount(width);
  return Math.max(Math.round((endTimeUnix - startTimeUnix) / barCount), 1);
};

export const formatFacetNameWithWildcard = (facetKey) => {
  if (facetKey.indexOf(`*${delimiter}`) === 0) {
    return `@${facetKey.split(`*${delimiter}`)[1]}`;
  }

  const parts = facetKey.split(delimiter);
  if (parts.length >= 2) {
    return formatFacetName(parts[0], parts[1]);
  }

  return null;
};

export const formatMilliseconds = (duration: number) => {
  if (duration < 1000) {
    return `${Math.round(duration)}ms`;
  }

  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - minutes * msInMinute;
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
  }

  return portions.join(' ');
};

const niceNum = (range, round) => {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
};

export const niceScale = (lowerBound, upperBound, maxTicks: number) => {
  const range = niceNum(upperBound - lowerBound, false);
  const tickSpacing = niceNum(range / (maxTicks - 1), true);
  const niceLowerBound = Math.floor(lowerBound / tickSpacing) * tickSpacing;
  const niceUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;

  return { niceLowerBound, niceUpperBound, tickSpacing };
};

export const getTicks = (
  niceUpperBound: number,
  tickSpacing: number,
): number[] => {
  const result = [];

  for (let i = 0; i < niceUpperBound / tickSpacing; i += 1) {
    result.push(i * tickSpacing);
  }

  return result;
};

export const isSelectedLog = ({ selectedLog, selectedLogFromContext, row }) =>
  (selectedLog && selectedLog === row) ||
  (selectedLogFromContext &&
    selectedLogFromContext.message === row.message &&
    selectedLogFromContext.timestamp === row.timestamp);
