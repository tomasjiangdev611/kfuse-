import { SizeObserver } from 'components';
import { useForm } from 'hooks';
import React, { useMemo } from 'react';
import { Chart, ChartGridItemType, DateSelection } from 'types';
import ChartGridItemInner from './ChartGridItemInner';

type Props = {
  chartGridItem: ChartGridItemType;
  date: DateSelection;
};

const ChartGridItem = ({ chartGridItem, date }: Props) => {
  const { charts, initialKey } = chartGridItem;

  const form = useForm({
    compare: null,
    key: initialKey ? initialKey : charts[0]?.key,
    isLogScaleEnabled: false,
    shouldShowTop5: true,
  });

  const { values } = form;
  const chartsByKey: { [key: string]: Chart } = useMemo(
    () => charts.reduce((obj, chart) => ({ ...obj, [chart.key]: chart }), {}),
    [charts],
  );

  const chart = chartsByKey[values.key] || null;

  return (
    <SizeObserver>
      {({ width }) =>
        width ? (
          <ChartGridItemInner
            chart={chart}
            chartGridItem={chartGridItem}
            date={date}
            form={form}
            width={width}
          />
        ) : null
      }
    </SizeObserver>
  );
};

export default ChartGridItem;
