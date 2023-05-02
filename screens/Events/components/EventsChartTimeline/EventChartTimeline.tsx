import { Loader } from 'components';
import { useMergeState } from 'hooks';
import React, { MutableRefObject, ReactElement } from 'react';
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DateSelection } from 'types/DateSelection';
import { convertNumberToReadableUnit, xAxisTickFormatter } from 'utils';

import EventsChartTimelineTooltip from './EventsChartTimelineTooltip';

type Props = {
  chartHeight: number;
  defaultColor?: string;
  elementRef: MutableRefObject<HTMLDivElement>;
  isLoadingLogCounts: boolean;
  timeline: { bars: any[]; labels: any[]; eventLevels: any[] };
  setDate?: (date: DateSelection) => void;
};

const EventsChartTimeline = ({
  chartHeight,
  defaultColor = '#000000',
  elementRef,
  isLoadingLogCounts,
  timeline,
  setDate,
}: Props): ReactElement => {
  const { bars, labels, eventLevels } = timeline;
  const [state, setState] = useMergeState({
    refAreaLeft: null,
    refAreaRight: null,
  });

  const onMouseUp = () => {
    setState((prevState) => {
      const { refAreaLeft, refAreaRight } = prevState;
      if (refAreaLeft && refAreaRight && refAreaLeft !== refAreaRight) {
        const startTimeUnix = labels[Math.min(refAreaLeft, refAreaRight)];
        const endTimeUnix = labels[Math.max(refAreaLeft, refAreaRight)];
        setDate && setDate({ startTimeUnix, endTimeUnix });
      }
      return { refAreaLeft: null, refAreaRight: null };
    });
  };

  return (
    <Loader
      className="logs__timeline__chart"
      isLoading={isLoadingLogCounts}
      ref={elementRef}
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ComposedChart
          data={bars}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          height={chartHeight}
          onMouseDown={(e: any) => {
            setState({ refAreaLeft: e.activeLabel });
          }}
          onMouseMove={(e: any) => {
            if (state.refAreaLeft) {
              setState({ refAreaRight: e.activeLabel });
            }
          }}
          onMouseUp={onMouseUp}
        >
          <Tooltip content={<EventsChartTimelineTooltip labels={labels} />} />
          {labels.length ? (
            <XAxis minTickGap={40} tickFormatter={xAxisTickFormatter(labels)} />
          ) : null}
          {bars.length ? (
            <YAxis
              domain={[0, 'auto']}
              tickFormatter={(s) => convertNumberToReadableUnit(s, 0)}
              type="number"
            />
          ) : null}
          {eventLevels.map(({ label, color }, index) => (
            <Bar
              key={index}
              dataKey={label}
              stackId="a"
              fill={color || defaultColor}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </Loader>
  );
};

export default EventsChartTimeline;
