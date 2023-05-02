import { Select } from 'components';
import { useForm } from 'hooks';
import React from 'react';
import { DateSelection } from 'types';
import ChartGridItemVisualization from './ChartGridItemVisualization';
import { Chart } from './types';

type Props = {
  chart: Chart;
  date: DateSelection;
};

const ChartGridItem = ({ chart, date }: Props) => {
  const { initialParam, options } = chart;

  const form = useForm({
    param: initialParam ? initialParam : chart.options[0].value,
  });

  const { propsByKey } = form;

  return (
    <div className="chart-grid__item">
      <div className="chart-grid__item__header">
        <Select
          className="select--thin"
          {...propsByKey('param')}
          options={options}
        />
      </div>
      <ChartGridItemVisualization chart={chart} date={date} form={form} />
    </div>
  );
};

export default ChartGridItem;
