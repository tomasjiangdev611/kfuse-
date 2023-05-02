import { useForm } from 'hooks';
import React from 'react';
import { Chart, DateSelection } from 'types';
import ChartGridItemHeader from './ChartGridItemHeader';
import ChartGridItemBody from './ChartGridItemBody';
import useChartGridItemData from './useChartGridItemData';

type Args = {
  chart: Chart;
  chartGridItemData: ReturnType<typeof useChartGridItemData>;
  date: DateSelection;
  form: ReturnType<typeof useForm>;
  width: number;
};

const renderChart = ({ chart, chartGridItemData, date, form, width }: Args) => {
  if (!chart || !width) {
    return null;
  }

  if (chart.render) {
    return chart.render();
  }

  return (
    <ChartGridItemBody
      chart={chart}
      chartGridItemData={chartGridItemData}
      date={date}
      form={form}
      width={width}
    />
  );
};

const ChartGridItemInner = ({ chart, chartGridItem, date, form, width }) => {
  const chartGridItemData = useChartGridItemData({
    chart,
    date,
    form,
    width,
  });

  return (
    <div className={`chart-grid__item chart-grid__item--${chart.key}`}>
      <ChartGridItemHeader
        chart={chart}
        chartGridItem={chartGridItem}
        chartGridItemData={chartGridItemData}
        date={date}
        form={form}
        width={width}
      />
      {renderChart({ chart, chartGridItemData, date, form, width })}
    </div>
  );
};

export default ChartGridItemInner;
