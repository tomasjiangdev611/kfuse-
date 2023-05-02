import classnames from 'classnames';
import { Loader, SizeObserver } from 'components';
import { useForm, useRequest } from 'hooks';
import { flatten } from 'lodash';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { queryRange } from 'requests';
import React, { useEffect, useMemo } from 'react';
import { BsBarChart } from 'react-icons/bs';
import { DateSelection } from 'types';
import ChartGridItemLegend from './ChartGridItemLegend';
import ChartGridTooltip from './ChartGridTooltip';
import {
  convertNumberToReadableUnit,
  xAxisTickFormatter as defaultXAxisTickFormatter,
} from 'utils';
import { Chart } from './types';
import { defaultFormatDatasets } from './utils';

type Props = {
  chart: Chart;
  date: DateSelection;
  form: ReturnType<typeof useForm>;
};

const ChartGridItemVisualization = ({ chart, date, form }: Props) => {
  const { param } = form.values;

  const {
    getDatasetsFormatter,
    getInstant,
    getXAxisTickFormatter,
    getYAxisTickFormatter,
    queries,
    step,
  } = chart;

  const chartType = chart.getChartType
    ? chart.getChartType(param)
    : chart.chartType;

  const colorMap = chart.colorMap || {};
  const labels = chart.labels || [];

  const queryRangeData = async (args) => {
    const results = await Promise.all(
      queries(args.param).map((query) =>
        queryRange({ date: args.date, instant: args.instant, query, step }),
      ),
    );

    const datasetsWithLabel = results.map((datasets, i) =>
      datasets.map((dataset) => ({ ...dataset, label: labels[i] || null })),
    );

    const flattenedDatesets = flatten(datasetsWithLabel);
    const formatter = getDatasetsFormatter ? getDatasetsFormatter(param) : null;
    return formatter
      ? formatter(flattenedDatesets)
      : defaultFormatDatasets(flattenedDatesets);
  };

  const queryRangeRequest = useRequest(queryRangeData);

  useEffect(() => {
    const instant = getInstant ? getInstant(param) : false;
    queryRangeRequest.call({ date, instant, param });
  }, [chart, param]);

  const result = queryRangeRequest.result || null;
  const data = result?.data || [];
  const keys = useMemo(() => result?.keys || [], [queryRangeRequest.result]);
  const timestamps = result?.timestamps || [];

  const showPlaceholder = data.length === 0;
  const customXAxisTickFormatter = getXAxisTickFormatter
    ? getXAxisTickFormatter(param)
    : null;
  const xAxisTickFormatter = customXAxisTickFormatter
    ? customXAxisTickFormatter(timestamps)
    : defaultXAxisTickFormatter(timestamps);

  const defaultYAxisFormatter = (s: number) =>
    convertNumberToReadableUnit(s, 0);
  const customYAxisTickFormatter = getYAxisTickFormatter
    ? getYAxisTickFormatter(param)
    : null;
  const yAxisTickFormatter =
    customYAxisTickFormatter ||
    chart.yAxisTickFormatter ||
    defaultYAxisFormatter;

  return (
    <>
      <SizeObserver className="chart-grid__item__body">
        {({ width, height }) => (
          <Loader
            className={classnames({
              'chart-grid__item__visualization': true,
              'chart-grid__item__visualization--placeholder': showPlaceholder,
            })}
            isLoading={queryRangeRequest.isLoading}
          >
            {showPlaceholder ? (
              <div
                className="chart-grid__item__visualization__placeholder"
                style={{ height: `${height}px`, width: `${width}px` }}
              >
                <div className="chart-grid__item__visualization__placeholder__icon">
                  <BsBarChart size={24} />
                </div>
                <div className="chart-grid__item__visualization__placeholder__text">
                  No Data Found
                </div>
              </div>
            ) : null}
            <ComposedChart
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
              width={width}
              height={height}
            >
              <CartesianGrid stroke="#f5f5f5" vertical={false} />
              {!showPlaceholder ? (
                <XAxis minTickGap={40} tickFormatter={xAxisTickFormatter} />
              ) : null}
              {!showPlaceholder ? (
                <YAxis
                  domain={[0, 'auto']}
                  tickFormatter={yAxisTickFormatter}
                  type="number"
                  width={40}
                />
              ) : null}
              <Tooltip content={<ChartGridTooltip timestamps={timestamps} />} />
              {keys.map((key) =>
                chartType === 'bar' ? (
                  <Bar
                    dataKey={key}
                    isAnimationActive={false}
                    fill={colorMap[key] || '#26BBF0'}
                    stackId="a"
                    type="monotone"
                  />
                ) : (
                  <Line
                    dataKey={key}
                    dot={false}
                    isAnimationActive={false}
                    stroke={colorMap[key] || '#26BBF0'}
                    strokeWidth={3}
                    type="monotone"
                  />
                ),
              )}
            </ComposedChart>
          </Loader>
        )}
      </SizeObserver>
      <ChartGridItemLegend
        colorMap={colorMap}
        key={keys.join('')}
        keys={keys}
      />
    </>
  );
};

export default ChartGridItemVisualization;
