import { ChartRenderer } from 'components/Chart';
import React, { ReactElement, useState } from 'react';
import ResizeObserver from 'rc-resize-observer';
import { Series } from 'uplot';

const Timeseries = ({
  chartData,
}: {
  chartData: { data: number[][]; series: Series[] };
}): ReactElement => {
  const [chartWidth, setChartWidth] = useState(800);
  return (
    <ResizeObserver onResize={(size) => setChartWidth(size.width - 16)}>
      <ChartRenderer
        chartTypes={['Line']}
        chartData={chartData || { data: [], series: [] }}
        isLoading={false}
        layoutType="dashboard"
        size={{ width: chartWidth, height: 300 }}
        styles={{ boxShadow: false }}
        tooltipType="compact"
        unit="number"
      />
    </ResizeObserver>
  );
};

export default Timeseries;
