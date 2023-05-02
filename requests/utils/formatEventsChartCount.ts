import dayjs from 'dayjs';
import { DateSelection } from 'types/DateSelection';
import { Series } from 'uplot';

import { getSeriesColor } from './transformPromqlDataset';

const getOneDataTimestamp = (data: {
  timestamp: string;
  count: number;
  values: string[];
}): number => {
  return dayjs(data?.timestamp).unix();
};

export const formatEventsChartCount = (
  data: Array<{
    timestamp: string;
    count: number;
    values: string[];
  }>,
  roundSecs: number,
  date: DateSelection,
  groupBys?: string[],
): {
  bars: Array<any>;
  eventLevels: Array<{ label: string; color: string }>;
  labels: Array<number>;
} => {
  const chartSeries: Array<any> = [];
  let timestampBitmaps: { [key: string]: any } = {};
  const eventLevels: { [key: string]: any } = {};

  if (data.length === 0) {
    return { bars: [], eventLevels: [], labels: [] };
  }

  const emptyFilledTimestamps = fillEmptyTimestamps(date, roundSecs, data[0]);
  timestampBitmaps = { ...timestampBitmaps, ...emptyFilledTimestamps };

  data.forEach((series) => {
    const { timestamp, count, values } = series;
    const timestampUnix = dayjs(timestamp).unix();
    const timestampBitmap = timestampBitmaps[timestampUnix] || {};
    values.forEach((value) => {
      timestampBitmap[value] = count;
      if (!eventLevels[value]) {
        eventLevels[value] = 0;
      }
    });
    if (values.length === 0 && groupBys.length === 0) {
      timestampBitmap['count'] = count;
      eventLevels['count'] = 0;
    }
    timestampBitmaps[timestampUnix] = timestampBitmap;
  });

  const timestamps = Object.keys(timestampBitmaps)
    .map((ts) => Number(ts))
    .sort();

  timestamps.forEach((timestamp) => {
    chartSeries.push(timestampBitmaps[timestamp]);
  });

  const eventLevelsArray: Array<{ label: string; color: string }> = [];
  const eventLevelsList = Object.keys(eventLevels);
  eventLevelsList.map((key, index) => {
    eventLevelsArray.push({
      label: key,
      color: getSeriesColor({ level: key }, index),
    });
  });

  return {
    bars: chartSeries,
    eventLevels: eventLevelsArray,
    labels: timestamps,
  };
};

export const formatEventsChartInTimeseries = (
  data: Array<{
    timestamp: string;
    count: number;
    values: string[];
  }>,
  roundSecs: number,
  date: DateSelection,
  groupBys?: string[],
): { data: number[][]; series: Series[] } => {
  let timestampBitmaps: { [key: string]: any } = {};
  const eventLevels: { [key: string]: number } = {};
  const alignedData: number[][] = [];
  const newSeries: Series[] = [];

  const emptyFilledTimestamps = fillEmptyTimestamps(date, roundSecs, data[0]);
  timestampBitmaps = { ...timestampBitmaps, ...emptyFilledTimestamps };

  data.forEach((series) => {
    const { timestamp, count, values } = series;
    const timestampUnix = dayjs(timestamp).unix();
    const timestampBitmap = timestampBitmaps[timestampUnix] || {};

    if (values.length > 0) {
      const key = values.join(', ');
      if (!timestampBitmap[key]) {
        timestampBitmap[key] = 0;
      }
      timestampBitmap[key] = count;

      if (!eventLevels[key]) {
        eventLevels[key] = 0;
      }
    }

    if (values.length === 0 && groupBys.length === 0) {
      timestampBitmap['count'] = count;
      eventLevels['count'] = 0;
    }
    timestampBitmaps[timestampUnix] = timestampBitmap;
  });

  const timestamps = Object.keys(timestampBitmaps)
    .map((ts) => Number(ts))
    .sort();

  alignedData.push(timestamps);
  // create array size of timestamps and fill with undefined
  const emptyArray = new Array(timestamps.length).fill(undefined);
  const eventLevelsList = Object.keys(eventLevels);

  eventLevelsList.forEach((key, idx: number) => {
    alignedData.push([...emptyArray]);
    newSeries.push({
      label: key,
      points: { show: false },
      show: true,
      stroke: getSeriesColor({ level: key }, idx),
    });
  });

  eventLevelsList.map((key, index) => (eventLevels[key] = index + 1));
  timestamps.forEach((timestamp, dataIdx) => {
    const timestampBitmap = timestampBitmaps[timestamp];
    const timestampBitmapKeys = Object.keys(timestampBitmap);
    timestampBitmapKeys.forEach((key) => {
      const seriesIndex = eventLevels[key];
      alignedData[seriesIndex][dataIdx] = timestampBitmap[key];
    });
  });

  return { data: alignedData, series: newSeries };
};

const fillEmptyTimestamps = (
  date: DateSelection,
  roundSecs: number,
  data: {
    timestamp: string;
    count: number;
    values: string[];
  },
): { [key: string]: any } => {
  const { startTimeUnix, endTimeUnix } = date;
  const dataTimestamp = getOneDataTimestamp(data);
  const timestampBitmaps: { [key: string]: any } = {};
  // go back direction
  for (
    let timestampUnix = dataTimestamp;
    timestampUnix >= startTimeUnix;
    timestampUnix -= roundSecs
  ) {
    timestampBitmaps[timestampUnix] = {};
  }
  // go forward direction
  for (
    let timestampUnix = dataTimestamp;
    timestampUnix <= endTimeUnix;
    timestampUnix += roundSecs
  ) {
    timestampBitmaps[timestampUnix] = {};
  }

  return timestampBitmaps;
};

export const formatEventsInTable = (
  data: Array<{ count: number; values: string[] }>,
  groupBys?: string[],
): Array<{ count: number; label: string }> => {
  const tableData = data.map((row) => {
    const { count, values } = row;
    const rowValues = groupBys.length === 0 ? ['count'] : values;
    return { count, label: rowValues.join(', ') };
  });
  return tableData;
};
