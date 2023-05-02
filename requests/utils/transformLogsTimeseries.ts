import { Series } from 'uplot';

import { getSeriesColor } from './transformPromqlDataset';

export const formatLogsTimeseriesDataset = (datasets) => {
  const timestampBitmap: { [key: string]: number } = {};
  const data = [];
  const series: Series[] = [];

  datasets.forEach((datum) => {
    const { dataset } = datum;
    dataset.forEach((timeseries) => {
      const { points } = timeseries;
      points.forEach((point) => {
        timestampBitmap[point.ts / 1000] = 1;
      });
    });
  });

  const timestamps = Object.keys(timestampBitmap)
    .map((ts) => Number(ts))
    .sort();
  data.push(timestamps);

  let counter = 0;
  datasets.forEach((datum) => {
    const { dataset, name } = datum;
    dataset.forEach((timeseries) => {
      const { points, tags } = timeseries;
      const valueByTimestamp = points.reduce(
        (obj, point) => ({ ...obj, [point.ts / 1000]: point.value }),
        {},
      );

      const timeseriesData = timestamps.map((ts) =>
        typeof valueByTimestamp[ts] === 'number'
          ? valueByTimestamp[ts]
          : undefined,
      );
      data.push(timeseriesData);
      series.push({
        label: `${name ? name : ''}${JSON.stringify(tags)}`,
        points: { show: false },
        stroke: getSeriesColor(tags, counter),
        show: true,
      });

      counter++;
    });
  });

  return { data, series };
};
