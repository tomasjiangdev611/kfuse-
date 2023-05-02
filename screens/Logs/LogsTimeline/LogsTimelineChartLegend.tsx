import { useRefAreaState } from 'hooks';
import React from 'react';
import LogsTimelineChartLegendRange from './LogsTimelineChartLegendRange';

type Props = {
  bars: { [key: string]: number }[];
  hoveredIndex?: number;
  labels: number[];
  refAreaState: ReturnType<typeof useRefAreaState>;
};

const LogsTimelineChartLegend = ({
  bars,
  hoveredIndex,
  labels,
  refAreaState,
}: Props) => {
  return (
    <LogsTimelineChartLegendRange bars={bars} refAreaState={refAreaState} />
  );
};

export default LogsTimelineChartLegend;
