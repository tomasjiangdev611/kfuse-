import { useForm } from 'hooks';
import React, { useEffect } from 'react';
import { Chart, DateSelection } from 'types';
import ChartGridItemLegend from './ChartGridItemLegend';
import ChartGridItemVisualization from './ChartGridItemVisualization';
import useChartGridItemData from './useChartGridItemData';

type Props = {
  chart: Chart;
  chartGridItemData: ReturnType<typeof useChartGridItemData>;
  date: DateSelection;
  form: ReturnType<typeof useForm>;
  width: number;
};

const ChartGridItemBody = ({
  chart,
  chartGridItemData,
  date,
  form,
  width,
}: Props) => {
  const { legendTableColumns, showCompactLegend } = chart;
  const { colorMap, data, deselectedKeysMap, keys, legendRows } =
    chartGridItemData;

  useEffect(() => {
    chartGridItemData.fetch();
  }, [chart]);

  return (
    <div className="chart-grid__item__inner">
      <ChartGridItemVisualization
        chartGridItemData={chartGridItemData}
        chart={chart}
        date={date}
        form={form}
        width={width}
      />
      <ChartGridItemLegend
        colorMap={colorMap}
        data={data}
        deselectedKeysMap={deselectedKeysMap}
        key={keys.join('')}
        keys={keys}
        legendRows={legendRows}
        legendTableColumns={legendTableColumns}
        showCompactLegend={showCompactLegend}
      />
    </div>
  );
};

export default ChartGridItemBody;
