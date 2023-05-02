import { colorsByLogLevel } from 'constants';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Bar, BarChart, Tooltip, YAxis } from 'recharts';
import { formatNumber } from 'utils';
import { getBarCount } from './utils';

const CustomTooltip = ({ active, payload, label, labels }) => {
  if (active && payload && payload.length) {
    return (
      <div className="logs__timeline__chart__tooltip">
        <div className="logs__timeline__chart__tooltip__inner">
          <div className="logs__timeline__chart__tooltip__label">
            {labels[label]}
          </div>
          <div className="logs__timeline__chart__tooltip__payload">
            {payload.map((row) => (
              <div className="logs__timeline__chart__tooltip__payload__row">
                <div
                  className="logs__timeline__chart__tooltip__payload__row__fill"
                  style={{ backgroundColor: row.fill }}
                />
                <div className="logs__timeline__chart__tooltip__payload__row__label">
                  {row.dataKey}
                </div>
                <div className="logs__timeline__chart__tooltip__payload__row__count">
                  {formatNumber(row.payload[row.dataKey])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const getData = (
  bucketSecs: number,
  date: any,
  logCounts: any[],
  width: number,
) => {
  const logsCountsByBucketStart = logCounts.reduce((obj, logCount) => {
    const bucketStartUnix = dayjs(logCount.bucketStart).unix();
    return {
      ...obj,
      [bucketStartUnix]: [...(obj[bucketStartUnix] || []), logCount],
    };
  }, {});

  const bars = [];
  const labels = [];
  const logLevelBitMap = {};

  const barCount = getBarCount(width);
  const firstLogCountAfterStartTimeUnix = logCounts.find(
    (logCount) => dayjs(logCount.bucketStart).unix() > date.startTimeUnix,
  );

  const startTimeUnix = firstLogCountAfterStartTimeUnix
    ? date.startTimeUnix +
      ((dayjs(firstLogCountAfterStartTimeUnix.bucketStart).unix() -
        date.startTimeUnix) %
        bucketSecs)
    : date.startTimeUnix;
  let highestBarCount = 0;

  for (let i = 0; i < barCount; i += 1) {
    const bucketStartUnix = startTimeUnix + i * bucketSecs;
    const bucketEndUnix = bucketStartUnix + bucketSecs;
    const bar = {};

    if (bucketEndUnix > date.endTimeUnix) {
      continue;
    }

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

    const barTotal = Math.max(...Object.values(bar));
    if (barTotal > highestBarCount) {
      highestBarCount = barTotal;
    }

    bars.push(bar);
    labels.push(dayjs.unix(bucketStartUnix).format('M/D h:mm:ss a'));
  }

  return {
    bars,
    highestBarCount,
    labels,
    logLevels: Object.keys(logLevelBitMap),
  };
};

const LogsStackedBarChart = ({ bucketSecs, date, logCounts, width }) => {
  const { bars, highestBarCount, labels, logLevels } = useMemo(
    () => getData(bucketSecs, date, logCounts, width),
    [bucketSecs, date, logCounts, width],
  );

  const max = Math.max(Math.round((highestBarCount * 1.1) / 10) * 10, 10);

  return (
    <BarChart
      data={bars}
      height={40}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
      width={width}
    >
      <Tooltip content={<CustomTooltip labels={labels} />} />
      <YAxis domain={[0, max]} hide type="number" />
      {logLevels.map((logLevel) => (
        <Bar
          dataKey={logLevel}
          stackId="a"
          fill={colorsByLogLevel[logLevel] || '#000000'}
        />
      ))}
    </BarChart>
  );
};

export default LogsStackedBarChart;
