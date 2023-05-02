import classnames from 'classnames';
import { Loader, PopoverTriggerV2, SizeObserver } from 'components';
import { useForm, useRefAreaState } from 'hooks';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import React from 'react';
import { BiError } from 'react-icons/bi';
import { BsBarChart } from 'react-icons/bs';
import { Chart, DateSelection } from 'types';
import ChartGridTooltip from './ChartGridTooltip';
import {
  convertNumberToReadableUnit,
  xAxisTickFormatter as defaultXAxisTickFormatter,
} from 'utils';
import useChartGridItemData from './useChartGridItemData';
import { isCompareKey } from './utils';

type Props = {
  chartGridItemData: ReturnType<typeof useChartGridItemData>;
  chart: Chart;
  date: DateSelection;
  form: ReturnType<typeof useForm>;
  width: number;
};

const ChartGridItemVisualization = ({
  chart,
  chartGridItemData,
  date,
  form,
  width,
}: Props) => {
  const {
    chartedData,
    colorMap,
    data,
    deselectedKeysMap,
    error,
    isLoading,
    keys,
    referenceLines,
    renderedKeys,
    renderTooltipTimestamp,
    stepInMs,
    timestamps,
  } = chartGridItemData;
  const { chartType, marginLeft, onSelection } = chart;
  const { isLogScaleEnabled } = form.values;

  const showPlaceholder = data.length === 0 || error;
  const xAxisTickFormatter = chart.xAxisTickFormatter
    ? chart.xAxisTickFormatter(timestamps)
    : defaultXAxisTickFormatter(timestamps);

  const defaultYAxisFormatter = (s: number) =>
    s < 1 && s > 0 ? s.toFixed(2) : convertNumberToReadableUnit(s, 1);

  const yAxisTickFormatter = chart.yAxisTickFormatter || defaultYAxisFormatter;

  const onMouseUpCallback = ({ refAreaLeft, refAreaRight }) => {
    const startIndex = Math.max(refAreaLeft + 1, 0);
    const endIndex = Math.min(refAreaRight, timestamps.length - 1);
    const start = timestamps[startIndex];
    const end = timestamps[endIndex];

    if (onSelection && end - start > 60 * 5) {
      onSelection(start, end);
    }
  };

  const refAreaState = useRefAreaState({
    onClearCallback: () => {},
    onMouseUpCallback,
    shouldResetAfterMouseUp: true,
  });

  const { onMouseMove, onMouseDown, onMouseUp, state } = refAreaState;
  const handlers = onSelection ? { onMouseDown, onMouseMove, onMouseUp } : {};

  return (
    <SizeObserver className="chart-grid__item__body">
      {({ height }) => (
        <Loader
          className={classnames({
            'chart-grid__item__visualization': true,
            'chart-grid__item__visualization--placeholder': showPlaceholder,
          })}
          isLoading={isLoading}
        >
          {showPlaceholder ? (
            <div
              className="chart-grid__item__visualization__placeholder"
              style={{ height: `${height}px`, width: `${width}px` }}
            >
              <div className="chart-grid__item__visualization__placeholder__icon">
                {error ? (
                  <BiError color="#da545b" size={24} />
                ) : (
                  <BsBarChart size={24} />
                )}
              </div>
              <div className="chart-grid__item__visualization__placeholder__text">
                {error ? 'Error fetching data' : 'No Data Found'}
              </div>
            </div>
          ) : (
            <ComposedChart
              data={chartedData}
              margin={{
                top: 20,
                right: 10,
                left: marginLeft || 0,
                bottom: 0,
              }}
              width={width}
              height={height}
              {...handlers}
            >
              <CartesianGrid stroke="#f5f5f5" vertical={false} />
              <XAxis minTickGap={40} tickFormatter={xAxisTickFormatter} />
              <YAxis
                {...(isLogScaleEnabled
                  ? {
                      allowDataOverflow: true,
                      domain: [0.01, 'auto'],
                      scale: 'log',
                    }
                  : { domain: [0, 'auto'] })}
                tickFormatter={yAxisTickFormatter}
                type="number"
                width={40}
              />
              <Tooltip
                content={
                  <ChartGridTooltip
                    compare={form.values.compare}
                    renderTooltipTimestamp={renderTooltipTimestamp}
                    stepInMs={chartType === 'bar' ? stepInMs : null}
                    timestamps={timestamps}
                  />
                }
              />
              {renderedKeys.map((key: string, i: number) =>
                chartType === 'bar' && !isCompareKey(key) ? (
                  <Bar
                    dataKey={key}
                    isAnimationActive={false}
                    fill={colorMap[key]}
                    stackId="a"
                    type="monotone"
                  />
                ) : (
                  <Line
                    connectNulls
                    dataKey={key}
                    dot={false}
                    isAnimationActive={false}
                    stroke={colorMap[key]}
                    strokeWidth={3}
                    type="monotone"
                  />
                ),
              )}
              {referenceLines
                .filter((referenceLine, i) => {
                  const prevReferenceLine = referenceLines[i - 1];
                  return !(
                    prevReferenceLine &&
                    (prevReferenceLine.x === referenceLine.x ||
                      prevReferenceLine.x === referenceLine.x - 1 ||
                      prevReferenceLine.x === referenceLine.x - 2)
                  );
                })
                .map((referenceLine, i) => (
                  <ReferenceLine
                    key={i}
                    x={referenceLine.x}
                    stroke="black"
                    strokeWidth={1}
                  >
                    {' '}
                    <Label value={referenceLine.label} position="top" />{' '}
                  </ReferenceLine>
                ))}
              {state.refAreaLeft && state.refAreaRight ? (
                <ReferenceArea
                  className="logs__timeline__chart__panned-area"
                  fill="#f3f4f5"
                  ifOverflow="extendDomain"
                  x1={Math.max(state.refAreaLeft, 0)}
                  x2={Math.min(state.refAreaRight - 1, chartedData.length - 1)}
                  strokeOpacity={0.3}
                />
              ) : null}
            </ComposedChart>
          )}
        </Loader>
      )}
    </SizeObserver>
  );
};

export default ChartGridItemVisualization;
