import classnames from 'classnames';
import { TooltipPosition, TooltipTrigger, useThemeContext } from 'components';
import { colorsByLogLevel } from 'constants';
import { Loader } from 'components';
import { useRefAreaState, useToggle } from 'hooks';
import React, { MutableRefObject, useEffect, useMemo } from 'react';
import { Minimize2 } from 'react-feather';
import { IoMdCheckboxOutline, IoMdSquareOutline } from 'react-icons/io';
import {
  Bar,
  ComposedChart,
  Label,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DateSelection } from 'types';
import { convertNumberToReadableUnit, xAxisTickFormatter } from 'utils';
import getTimeline from './getTimeline';
import LogsTimelineChartLegend from './LogsTimelineChartLegend';
import LogsTimelineChartPannedAreaTooltip from './LogsTimelineChartPannedAreaTooltip';
import LogsTimelineChartTooltip from './LogsTimelineChartTooltip';
import LogsTimelineChartUnpannedAreaHandle from './LogsTimelineChartUnpannedAreaHandle';
import useCompareTimeline from './useCompareTimeline';

const getCompareLabel = (date: DateSelection) => {
  const { startTimeUnix, endTimeUnix } = date;
  const diff = endTimeUnix - startTimeUnix;

  if (diff > 60 * 60 * 24 * 365) {
    return null;
  }

  if (diff > 60 * 60 * 24 * 30) {
    return 'last year';
  }

  if (diff > 60 * 60 * 24 * 7) {
    return 'last month';
  }

  if (diff > 60 * 60 * 24) {
    return 'last week';
  }

  return 'yesterday';
};

type Props = {
  compareTimeline: ReturnType<typeof useCompareTimeline>;
  date: DateSelection;
  elementRef: MutableRefObject<HTMLDivElement>;
  isLoadingLogCounts: boolean;
  setDateZoomed: (args: any) => void;
  showTimelineToggle: ReturnType<typeof useToggle>;
  timeline: ReturnType<typeof getTimeline>;
};

const mergeTimelines = (
  timeline: ReturnType<typeof getTimeline>,
  compareTimeline: ReturnType<typeof useCompareTimeline>['compareTimeline'],
) => {
  const { labels, logLevels, selectedIndex, total } = timeline;
  const bars = timeline.bars.map(
    (bar: { [key: string]: number }, index: number) => ({
      ...bar,
      compare: compareTimeline.logLevels.reduce(
        (sum: number, logLevel: string) =>
          sum +
          (compareTimeline.bars[index] && compareTimeline.bars[index][logLevel]
            ? compareTimeline.bars[index][logLevel]
            : 0),
        0,
      ),
    }),
  );

  return {
    bars,
    labels,
    logLevels,
    selectedIndex,
    total,
  };
};

const LogsTimelineInnerChart = ({
  date,
  compareTimeline,
  elementRef,
  isLoadingLogCounts,
  setDateZoomed,
  showTimelineToggle,
  timeline,
}: Props) => {
  const { utcTimeEnabled } = useThemeContext();
  const onClearCallback = () => {
    setDateZoomed({
      zoomedStartTimeUnix: null,
      zoomedEndTimeUnix: null,
    });
  };

  const onMouseUpCallback = ({ refAreaLeft, refAreaRight }) => {
    const startIndex = Math.max(refAreaLeft + 1, 0);
    const endIndex = Math.min(refAreaRight, labels.length - 1);
    setDateZoomed({
      zoomedStartTimeUnix: labels[startIndex],
      zoomedEndTimeUnix: labels[endIndex],
    });
  };

  const refAreaState = useRefAreaState({ onClearCallback, onMouseUpCallback });
  const { clear, state, onMouseDown, onMouseMove, onMouseUp } = refAreaState;
  const { isDragging, panMode } = state;

  const { bars, labels, logLevels } = useMemo(
    () => mergeTimelines(timeline, compareTimeline.compareTimeline),
    [timeline, compareTimeline.compareTimeline],
  );

  const compareLabel = getCompareLabel(date);

  useEffect(() => {
    clear();
  }, [date.startTimeUnix, date.endTimeUnix]);

  return (
    <div className="logs__timeline">
      <div className="logs__timeline__toolbar">
        <div className="logs__timeline__toolbar__left">
          <LogsTimelineChartLegend
            bars={bars}
            labels={labels}
            refAreaState={refAreaState}
          />
        </div>
        <div className="logs__timeline__toolbar__right">
          <div className="logs__timeline__toolbar__item">
            <div className="logs__timeline__toolbar__item__label">Compare</div>
            <div className="logs__timeline__toolbar__item__value">
              {compareLabel ? (
                <div
                  className={classnames({
                    'button-group': true,
                    'button-group--short': true,
                    'button-group--active': compareTimeline.enabled,
                  })}
                >
                  <button
                    className={classnames({
                      'button-group__item': true,
                      'button-group__item--active': compareTimeline.enabled,
                    })}
                    onClick={compareTimeline.toggle}
                  >
                    <div className="button-group__item__icon">
                      {compareTimeline.enabled ? (
                        <IoMdCheckboxOutline size={14} />
                      ) : (
                        <IoMdSquareOutline size={14} />
                      )}
                    </div>
                    {`Same time ${compareLabel}`}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="logs__timeline__toolbar__item">
            <TooltipTrigger
              position={TooltipPosition.TOP_RIGHT}
              tooltip="Hide Timeline"
            >
              <button
                className="button button--icon"
                onClick={showTimelineToggle.off}
              >
                <Minimize2 size={12} />
              </button>
            </TooltipTrigger>
          </div>
        </div>
      </div>
      <div className="logs__timeline__inner">
        <Loader
          className="logs__timeline__chart"
          isLoading={isLoadingLogCounts}
          ref={elementRef}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={bars}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            >
              {labels.length ? (
                <XAxis
                  minTickGap={40}
                  tickFormatter={xAxisTickFormatter(labels, utcTimeEnabled)}
                />
              ) : null}
              {bars.length ? (
                <YAxis
                  domain={[0, 'auto']}
                  tickFormatter={(s) => convertNumberToReadableUnit(s, 0)}
                  type="number"
                />
              ) : null}
              {logLevels.map((logLevel, index) => (
                <Bar
                  key={index}
                  dataKey={logLevel}
                  stackId="a"
                  fill={colorsByLogLevel[logLevel] || '#000000'}
                />
              ))}
              {compareTimeline.enabled ? (
                <Line
                  dataKey="compare"
                  dot={false}
                  isAnimationActive={false}
                  stroke="#003f5c"
                  strokeWidth={3}
                  type="monotone"
                />
              ) : null}
              {state.refAreaLeft ? (
                <ReferenceArea
                  className="logs__timeline__chart__unpanned-area"
                  fill="#d7dadf"
                  fillOpacity={0.4}
                  ifOverflow="extendDomain"
                  x1={0}
                  x2={state.refAreaLeft}
                />
              ) : null}
              {state.refAreaRight ? (
                <ReferenceArea
                  className="logs__timeline__chart__unpanned-area"
                  fill="#d7dadf"
                  fillOpacity={0.4}
                  ifOverflow="extendDomain"
                  x1={state.refAreaRight}
                  x2={labels.length - 1}
                />
              ) : null}
              {state.refAreaLeft && state.refAreaRight ? (
                <ReferenceArea
                  className="logs__timeline__chart__panned-area"
                  fill="transparent"
                  ifOverflow="extendDomain"
                  x1={Math.max(state.refAreaLeft, 0)}
                  x2={Math.min(state.refAreaRight - 1, bars.length - 1)}
                  strokeOpacity={0.3}
                >
                  <Label
                    content={(props) => (
                      <LogsTimelineChartPannedAreaTooltip
                        {...props}
                        labels={labels}
                        onClearCallback={onClearCallback}
                        refAreaState={refAreaState}
                        utcTimeEnabled={utcTimeEnabled}
                      />
                    )}
                    position="insideBottom"
                  />
                </ReferenceArea>
              ) : null}
              {state.refAreaLeft && bars.length ? (
                <ReferenceLine
                  label={(props) => (
                    <LogsTimelineChartUnpannedAreaHandle {...props} />
                  )}
                  stroke="#73829a"
                  strokeWidth="1px"
                  x={state.refAreaLeft}
                />
              ) : null}
              {state.refAreaRight && bars.length ? (
                <ReferenceLine
                  label={(props) => (
                    <LogsTimelineChartUnpannedAreaHandle {...props} />
                  )}
                  x={state.refAreaRight}
                  stroke="#73829a"
                  strokeWidth="1px"
                />
              ) : null}
              {isDragging || panMode !== null ? null : (
                <Tooltip
                  content={(props) => (
                    <LogsTimelineChartTooltip
                      {...props}
                      labels={labels}
                      utcTimeEnabled={utcTimeEnabled}
                    />
                  )}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </Loader>
      </div>
    </div>
  );
};

export default LogsTimelineInnerChart;
