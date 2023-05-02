import { Heatmap } from 'components/Chart';
import { useMetricsQueryState } from 'hooks';
import React, { ReactElement } from 'react';

const HeatmapGraph = ({
  metricsQueryState,
}: {
  metricsQueryState: ReturnType<typeof useMetricsQueryState>;
}): ReactElement => {
  const { chartData } = metricsQueryState;

  return (
    <div>
      <Heatmap
        chartHeight={300}
        chartNormalizedType="number"
        chartWidth={document.body.clientWidth - 120}
        grafanaData={chartData.chart_1 || { data: [], series: [] }}
        isLoading={false}
      />
    </div>
  );
};

export default HeatmapGraph;
