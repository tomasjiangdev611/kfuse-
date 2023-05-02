import dayjs from 'dayjs';
import { Log } from 'types';
import { getBucketSecs } from '../utils';

const getInitialBucketStart = ({ bucketSecs, bucketStarts, startTimeUnix }) => {
  if (bucketStarts.length) {
    const lowestBucketStart = bucketStarts[0];

    for (let i = lowestBucketStart; i >= startTimeUnix; i -= bucketSecs) {
      if (i - bucketSecs <= startTimeUnix) {
        return i;
      }
    }
  }

  return null;
};

const getTimeline = (
  date: any,
  logCounts: any[],
  selectedLog: Log,
  width: number,
) => {
  const logsCountsByBucketStart = logCounts.reduce((obj, logCount) => {
    const bucketStartUnix = dayjs(logCount.bucketStart).unix();
    return {
      ...obj,
      [bucketStartUnix]: [...(obj[bucketStartUnix] || []), logCount],
    };
  }, {});

  const selectedLogUnix = selectedLog
    ? dayjs(selectedLog.timestamp).unix()
    : null;

  const bars = [];
  const labels = [];
  const logLevelBitMap = {};
  let selectedIndex = null;

  const { endTimeUnix, startTimeUnix } = date;
  const bucketSecs = getBucketSecs(date, width);

  let total = 0;

  const bucketStarts = Object.keys(logsCountsByBucketStart)
    .map((bucketStart) => Number(bucketStart))
    .sort();
  const initialBucketStart = getInitialBucketStart({
    bucketSecs,
    bucketStarts,
    startTimeUnix,
  });

  if (initialBucketStart) {
    for (
      let bucketStartUnix = initialBucketStart;
      bucketStartUnix <= endTimeUnix + bucketSecs;
      bucketStartUnix += bucketSecs
    ) {
      if (
        bucketStartUnix <= endTimeUnix ||
        logsCountsByBucketStart[bucketStartUnix]
      ) {
        const i = bars.length;
        const bucketEndUnix = bucketStartUnix + bucketSecs;
        const bar: { [key: string]: number } = {};

        if (logsCountsByBucketStart[bucketStartUnix]) {
          logsCountsByBucketStart[bucketStartUnix].forEach((bucket) => {
            const { facetValue } = bucket;
            logLevelBitMap[facetValue] = 1;

            if (!bar[facetValue]) {
              bar[facetValue] = 0;
            }

            bar[facetValue] += bucket.count;
          });
        }

        const barTotal = Object.values(bar).reduce(
          (sum, count) => sum + count,
          0,
        );

        if (isFinite(barTotal)) {
          total += barTotal;
        }

        bars.push(bar);

        labels.push(bucketStartUnix);

        if (
          selectedLogUnix &&
          selectedLogUnix >= bucketStartUnix &&
          selectedLogUnix < bucketEndUnix
        ) {
          selectedIndex = i;
        }
      }
    }
  }

  return {
    bars,
    labels,
    logLevels: Object.keys(logLevelBitMap),
    selectedIndex,
    total,
  };
};

export default getTimeline;
