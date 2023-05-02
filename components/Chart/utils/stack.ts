import { Band, Cursor, Series } from 'uplot';

export const stack = (
  data: number[][],
  omit: any,
): {
  data: number[][];
  bands: any;
} => {
  const data2 = [];
  let bands = [];
  const dataLength = data[0].length;
  const accum = Array(dataLength);

  for (let i = 0; i < dataLength; i++) accum[i] = 0;

  for (let i = 1; i < data.length; i++)
    data2.push(
      omit(i) ? data[i] : data[i].map((v, i) => (accum[i] += v ? +v : 0)),
    );

  for (let i = 1; i < data.length; i++)
    !omit(i) &&
      bands.push({
        series: [data.findIndex((s, j) => j > i && !omit(j)), i],
      });

  bands = bands.filter((b) => b.series[1] > -1);

  return {
    data: [data[0]].concat(data2),
    bands,
  };
};

export const getStackedOpts = (
  series: Series[],
  data: number[][],
): { cursor: Cursor; hooks?: any; series: Series[] } => {
  const opts: { cursor: Cursor; hooks?: any; series: Series[] } = {
    cursor: {},
    series,
  };

  opts.cursor.dataIdx = (u, seriesIdx, closestIdx) => {
    return data[seriesIdx][closestIdx] == null ? null : closestIdx;
  };

  opts.series.forEach((s) => {
    s.value = (_u, _xValue, seriesIdx, pointIdx) => data[seriesIdx][pointIdx];
    s.points = s.points || {};
    // scan raw unstacked data to return only real points
    s.points.filter = (u, seriesIdx, show) => {
      if (show) {
        const points: any = [];
        data[seriesIdx].forEach((v, i) => {
          v != null && points.push(i);
        });
        return points;
      }
    };
  });

  // restack on toggle
  opts.hooks = {
    setSeries: [
      (u) => {
        // const stacked = stack(data, (idx: number) => !u.series[idx].show);
        // u.delBand(null);
        // stacked.bands.forEach((band: Band) => u.addBand(band));
        // u.setData(stacked.data);
      },
    ],
    init: [
      (u) => {
        const stacked = stack(data, (idx: number) => !u.series[idx].show);
        stacked.bands.forEach((band: Band) => u.addBand(band));
        u.setData(stacked.data);
      },
    ],
  };

  return opts;
};
