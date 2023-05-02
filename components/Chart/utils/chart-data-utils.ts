import { DateSelection } from 'types/DateSelection';
import { Series } from 'uplot';
import { queryRangeTimeDuration } from 'utils';

import { chartColors } from '../../Theme';

export const buildChartDataSeries = (
  grafanaData: Array<{ metric: any; values: Array<any> }>,
): { data: Array<any>; series: Series[] } => {
  const series: Series[] = [];
  const data: Array<any> = [];

  if (grafanaData.length) {
    const timestamps = grafanaData[0].values.map((v) => v[0]);
    data.push(timestamps);

    grafanaData.forEach((d, i) => {
      const seriesName = d.metric.__name__;
      delete d.metric.__name__;
      series.push({
        label: `${seriesName}${JSON.stringify(d.metric)}`,
        points: { show: true, fill: chartColors[i % chartColors.length] },
        stroke: chartColors[i % 10],
        show: true,
      });
      data.push(d.values.map((v) => v[1]));
    });
  }
  return { data, series };
};

/**
 * Return array of timestamps for the given date selection
 * @param date
 */
export const getNoDataPlaceholder = (date: DateSelection): number[][] => {
  const steps = queryRangeTimeDuration(date);

  const { startTimeUnix, endTimeUnix } = date;
  const timeGap = Math.floor((endTimeUnix - startTimeUnix) / steps);

  const timestamps = [];
  for (let i = 0; i < steps; i++) {
    timestamps.push(startTimeUnix + i * timeGap);
  }

  return [timestamps, timestamps.map(() => 100)];
};

/**
 * Return series for empty chart
 */
export const getNoDataSeries = (seriesCount: number): Series[] => {
  if (seriesCount === 0) {
    return [{ show: true }, { show: true, label: '', points: { show: false } }];
  }
  return [{ show: true }];
};
