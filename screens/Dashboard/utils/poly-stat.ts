import { convertNumberToReadableUnit } from 'utils/formatNumber';

import { getFomattedLegend } from './legend-utils';
import { statEvaluatedValue } from './stat-utils';
import { DashboardPanelProps } from '../types';

export const getPolyStatData = (
  data: Array<{
    metric: { [key: string]: any };
    value: [number, string];
    promIndex: number;
  }>,
  panel: DashboardPanelProps,
) => {
  const polyStats = [];
  const { targets, fieldConfig } = panel;

  data.forEach(({ metric, value, promIndex }) => {
    const legend = getFomattedLegend(promIndex, metric, targets);
    const [ts, val] = value;

    const { color, text, prefix, suffix } = statEvaluatedValue({
      panel,
      result: [{ metric, value }],
    });

    let newValue = `${prefix || ''}${text}${suffix || ''}`;

    if (Number(newValue) > 0) {
      newValue = convertNumberToReadableUnit(Number(text), 2);
    }

    polyStats.push({
      color: color,
      label: legend,
      timestamp: ts,
      value: newValue,
    });
  });

  return polyStats;
};
