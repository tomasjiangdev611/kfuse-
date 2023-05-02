import { chartColors } from 'components/Theme';
import { Series } from 'uplot';

const transformGrafanaQueryData = (
  grafanaQueryData: any,
): {
  data: Array<Array<number>>;
  series: Series[];
} => {
  const chartData: Array<Array<number>> = [];
  const chartSeries: Series[] = [];
  const timestampBitmap: { [key: string]: number } = {};
  const frameList = Object.keys(grafanaQueryData);
  frameList.forEach((key) => {
    const frames = grafanaQueryData[key].frames;
    frames.forEach((frame: any) => {
      const [time, value] = frame.data.values;
      time.forEach((ts: number) => {
        timestampBitmap[ts / 1000] = 1;
      });
    });
  });

  const timestamps = Object.keys(timestampBitmap)
    .map((ts) => Number(ts))
    .sort();
  chartData.push(timestamps);

  frameList.forEach((key) => {
    const frames = grafanaQueryData[key].frames;
    frames.forEach((frame: any, counter: number) => {
      const { data, schema } = frame;
      chartSeries.push({
        label: schema.name,
        points: { show: true, fill: chartColors[counter % chartColors.length] },
        stroke: chartColors[counter % chartColors.length],
        show: true,
      });

      const [time, value] = data.values;
      const values = [];
      for (let i = 0; i < timestamps.length; i++) {
        values.push(value[i] || undefined);
      }
      chartData.push(values);
    });
  });

  return { data: chartData, series: chartSeries };
};

export default transformGrafanaQueryData;
