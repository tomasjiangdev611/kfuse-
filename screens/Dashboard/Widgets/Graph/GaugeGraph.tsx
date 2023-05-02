import { Gauge } from 'components';
import React, { ReactElement, useMemo } from 'react';
import { RequestResult } from 'types';
import { Series } from 'uplot';

import { DashboardPanelNoData } from '../../components';
import { DashboardPanelProps } from '../../types';
import { checkIfDataNotAvailable, statEvaluatedValue } from '../../utils';

export const getLastValue = (data: any[]): number => {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] !== null) {
      return data[i];
    }
  }
};

const GaugeGraph = ({
  baseWidth,
  chartSize,
  dashboardDataLoader,
  panel,
}: {
  baseWidth: number;
  chartSize: { width: number; height: number };
  dashboardDataLoader: RequestResult;
  panel: DashboardPanelProps;
}): ReactElement => {
  if (!dashboardDataLoader.result) {
    return null;
  }

  const gaugeData = useMemo(() => {
    if (!dashboardDataLoader.result) return [];

    const newData: Array<{ label: string; max: number; stat: any }> = [];
    const { data, series } = dashboardDataLoader.result;

    series.forEach((s: Series, idx: number) => {
      const value = getLastValue(data[idx + 1]);
      const {
        color: textColor,
        prefix,
        text,
        suffix,
      } = statEvaluatedValue({
        panel,
        result: [{ metric: {}, value: [0, value] }],
      });

      newData.push({
        label: s.label === '{}' ? '' : s.label,
        max: Math.max(...data[idx + 1]),
        stat: { prefix: prefix || '', value: Number(text), suffix, textColor },
      });
    });

    return newData;
  }, [dashboardDataLoader.result]);

  return (
    <>
      {!checkIfDataNotAvailable(dashboardDataLoader.result) ? (
        <Gauge
          chartHeight={chartSize.height}
          chartWidth={chartSize.width}
          gaugeData={gaugeData}
        />
      ) : (
        <DashboardPanelNoData gridPos={panel.gridPos} baseWidth={baseWidth} />
      )}
    </>
  );
};

export default GaugeGraph;
