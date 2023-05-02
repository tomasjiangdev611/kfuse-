import { getSeriesColor } from 'requests';
import { Series } from 'uplot';
import { replaceLegendVariables } from 'utils/MetricsQueryBuilder';

import { DashboardPanelProps } from '../types';

export const formatDashboardLegend = (
  idx: number,
  promIndex: number,
  metric: { [key: string]: any },
  targets: DashboardPanelProps['targets'],
): Series => {
  const isSeriesOutlier = metric['outlier'];
  const outlierSeriesWidth = isSeriesOutlier === 'true' ? 2.5 : 0.5;
  const label = getFomattedLegend(promIndex, metric, targets);

  return {
    label,
    points: { show: false },
    stroke: getSeriesColor(metric, idx),
    show: true,
    width: isSeriesOutlier ? outlierSeriesWidth : 1,
  };
};

export const getFomattedLegend = (
  promIndex: number,
  metric: { [key: string]: any },
  targets: DashboardPanelProps['targets'],
): string => {
  const legendFormat = getActiveLegendFomart(promIndex, targets);
  if (legendFormat) {
    return replaceLegendVariables(legendFormat, metric);
  }

  const metricName = metric.__name__;
  delete metric.__name__;

  if (Object.keys(metric).length === 1) {
    return `${metricName ? metricName : ''}${Object.values(metric)[0]}`;
  }

  return `${metricName ? metricName : ''}${JSON.stringify(metric)}`;
};

const getActiveLegendFomart = (
  promIndex: number,
  targets: DashboardPanelProps['targets'],
): string => {
  const activeTargets = targets.filter((target) => !target.hide);

  if (activeTargets.length === 0) {
    return null;
  }

  const legendFormat = activeTargets[promIndex]?.legendFormat;
  if (legendFormat && legendFormat !== '__auto') {
    return legendFormat;
  }

  return null;
};

export const getStatFormattedLegend = (
  promIndex: number,
  metric: { [key: string]: any },
  targets: DashboardPanelProps['targets'],
): string => {
  const legendFormat = getActiveLegendFomart(promIndex, targets);
  if (legendFormat) {
    return replaceLegendVariables(legendFormat, metric);
  }

  return '';
};
