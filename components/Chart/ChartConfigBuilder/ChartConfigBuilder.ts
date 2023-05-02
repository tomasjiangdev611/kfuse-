import uPlot, { Series } from 'uplot';

import { UPlotConfig, ChartConfigProps } from '../types';
import {
  convertToReadableTime,
  formatYAxis,
  getAreaSeries,
  getBarSeries,
  getLineSeries,
  getNoDataSeries,
  getStackedOpts,
  getUplotChartBar,
  getChartYAxisWidth,
} from '../utils';

const formatXAxis = (vals: Array<number>) => {
  return convertToReadableTime(vals);
};

const getBaseConfig = (darkModeEnabled: boolean, unit: string) => {
  const config: UPlotConfig = {
    width: 1000,
    height: 340,
    axes: [
      {
        size: 36,
        stroke: darkModeEnabled ? '#bdbbc5' : '#030303',
        grid: {
          stroke: darkModeEnabled ? '#414141' : '#f0f0f0',
          width: 0.8,
        },
        values: (u, vals, space) => formatXAxis(vals),
      },
      {
        size: 60,
        stroke: darkModeEnabled ? '#bdbbc5' : '#030303',
        grid: {
          stroke: darkModeEnabled ? '#414141' : '#f0f0f0',
          width: 0.8,
        },
        values: (u, vals, space) => formatYAxis(vals, unit),
      },
    ],
    cursor: {
      focus: { prox: 5 },
      drag: { x: true, y: false },
    },
    series: [],
    legend: { show: false },
    hooks: {},
  };
  config.addHook = (type, hook) => {
    if (!config.hooks[type]) {
      config.hooks[type] = [];
    }

    config.hooks[type]?.push(hook as any);
  };

  return config;
};

const getConfig = ({
  bands = [],
  unit,
  chartStyles,
  darkModeEnabled,
  data,
  hooks,
  maxValue,
  series,
  size: { width: chartWidth, height: chartHeight },
  type,
}: ChartConfigProps): UPlotConfig => {
  const { fillOpacity, lineWidth, pointSize, showPoints, scaleDistribution } =
    chartStyles;
  const config = getBaseConfig(darkModeEnabled, unit);
  const newConfig = {
    ...config,
    bands,
    height: chartHeight,
    width: chartWidth,
  };

  newConfig.axes[1].size = getChartYAxisWidth(
    maxValue,
    unit,
    scaleDistribution,
  );

  if (scaleDistribution?.type === 'log') {
    newConfig.scales = {
      x: { time: true, auto: true },
      y: { distr: 3, auto: true, log: scaleDistribution.log || 2 },
    };
  }

  if (hooks) {
    hooks.forEach(({ type, hook }) => {
      newConfig.addHook(type, hook);
    });
  }

  if (type === 'Line') {
    const newSeries = getLineSeries(
      series,
      fillOpacity,
      pointSize,
      showPoints,
      lineWidth,
    );
    newConfig.series = [...getNoDataSeries(series.length), ...newSeries];
    return newConfig;
  }

  if (type === 'Bar') {
    const newSeries = getBarSeries(chartWidth, data, series);
    newConfig.series = [...getNoDataSeries(series.length), ...newSeries];
    return newConfig;
  }

  if (type === 'Stacked Bar') {
    if (!data[0]?.length) {
      newConfig.series = [...getNoDataSeries(series.length)];
      return newConfig;
    }
    const { cursor, hooks, series: optsSeries } = getStackedOpts(series, data);
    const bars60_100 = getUplotChartBar(chartWidth, data);
    const newSeries: Series[] = [];
    optsSeries?.forEach((s) => {
      newSeries.push({ ...s, ...{ fill: s.stroke, paths: bars60_100 } });
    });

    newConfig.addHook('setSeries', hooks?.setSeries[0]);
    newConfig.addHook('init', hooks?.init[0]);
    newConfig.cursor = {
      ...newConfig.cursor,
      ...cursor,
      ...{ focus: { prox: 10 } },
    };

    newConfig.series = [...getNoDataSeries(series.length), ...newSeries];
    return newConfig;
  }

  if (type === 'Area') {
    const newSeries = getAreaSeries(series);
    newConfig.series = [...getNoDataSeries(series.length), ...newSeries];
    return newConfig;
  }
};

export default getConfig;
