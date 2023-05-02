import { Loader, Resizer, ResizerOrientation, RightSidebar } from 'components';
import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { describeTrace } from 'requests';
import { DateSelection, Span, Trace } from 'types';
import { formatDurationNs, isSpanRoot } from 'utils';
import TraceSidebarActiveSpan from './TraceSidebarActiveSpan';
import TraceSidebarCursorTooltip from './TraceSidebarCursorTooltip';
import TraceSidebarLatencyTooltip from './TraceSidebarLatencyTooltip';
import TraceSidebarMain from './TraceSidebarMain';

const getTotalDurationInNs = (spans: Span[]): number => {
  let minStartTimeNs: number = null;
  let maxEndTimeNs: number = null;

  spans.forEach((span) => {
    const { endTimeNs, startTimeNs } = span;
    if (!maxEndTimeNs || endTimeNs > maxEndTimeNs) {
      maxEndTimeNs = endTimeNs;
    }

    if (!minStartTimeNs || startTimeNs < minStartTimeNs) {
      minStartTimeNs = startTimeNs;
    }
  });

  if (maxEndTimeNs && minStartTimeNs) {
    return maxEndTimeNs - minStartTimeNs;
  }

  return 0;
};

type Props = {
  close: VoidFunction;
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  trace: Trace;
};

const TraceSidebar = ({ close, colorsByServiceName, date, trace }: Props) => {
  const [height, setHeight] = useState(360);
  const onResize = ({ deltaY }) => {
    setHeight((prevHeight) => Math.max(prevHeight - deltaY, 120));
  };

  const describeTraceRequest = useRequest((args) =>
    describeTrace(args).then(({ spans, traceMetrics }) => ({
      rootSpan: spans.find(isSpanRoot),
      spans,
      traceMetrics,
    })),
  );

  const activeTrace = useMemo(
    () => describeTrace.result || trace,
    [describeTrace.result],
  );

  const { span, traceId } = activeTrace;
  const rootSpan = describeTraceRequest.result?.rootSpan || null;
  const traceMetrics = describeTraceRequest.result?.traceMetrics || null;

  const spans = useMemo(
    () => describeTraceRequest.result?.spans || [],
    [describeTraceRequest.result],
  );

  const totalDurationInNs = useMemo(() => getTotalDurationInNs(spans), [spans]);

  const [hoveredSpanId, setHoveredSpanId] = useState<string>(null);
  const [clickedSpanId, setClickedSpanId] = useState<string>(trace.span.spanId);

  const clickedSpan = useMemo(
    () => spans.find((span) => span.spanId === clickedSpanId),
    [clickedSpanId, describeTraceRequest.result],
  );

  const hoveredSpan = useMemo(
    () => spans.find((span) => span.spanId === hoveredSpanId),
    [hoveredSpanId, describeTraceRequest.result],
  );

  const setClickedSpanIdHandler = (nextClickedSpanId: string) => {
    setClickedSpanId((prevClickedSpanId) =>
      nextClickedSpanId === prevClickedSpanId ? null : nextClickedSpanId,
    );
  };

  useEffect(() => {
    describeTraceRequest.call({ traceId, startTimeNs: trace.span.startTimeNs });
  }, [date]);

  return (
    <RightSidebar
      className="trace-sidebar"
      close={close}
      title={trace.span.name}
    >
      <div className="trace-sidebar__time">
        <div className="trace-sidebar__time__left">
          <div className="trace-sidebar__time__item">
            <AiOutlineClockCircle size={14} />
          </div>
          <div className="trace-sidebar__time__item">
            {rootSpan
              ? `${formatDurationNs(totalDurationInNs, 1, 1)} Total Duration`
              : null}
          </div>
          <div className="trace-sidebar__time__item">
            {rootSpan ? (
              <TraceSidebarLatencyTooltip label="trace" span={rootSpan} />
            ) : null}
          </div>
        </div>
        <div className="trace-sidebar__time__right">
          {`on ${dayjs(Math.round(span.startTimeNs / 1000000)).format(
            'MMM D, YYYY H:mm:ss.SSS',
          )}`}
        </div>
      </div>
      <Loader
        className="trace-sidebar__body"
        isLoading={describeTraceRequest.isLoading}
      >
        <div className="trace-sidebar__body__top">
          {traceMetrics ? (
            <TraceSidebarMain
              clickedSpanId={clickedSpanId}
              colorsByServiceName={colorsByServiceName}
              hoveredSpanId={hoveredSpanId}
              setClickedSpanId={setClickedSpanIdHandler}
              setHoveredSpanId={setHoveredSpanId}
              spans={spans}
              traceMetrics={traceMetrics}
            />
          ) : null}
          <Resizer
            onMouseMove={onResize}
            orientation={ResizerOrientation.horizontal}
          />
        </div>
        {clickedSpan ? (
          <div
            className="trace-sidebar__body__bottom"
            style={{ height: `${height}px` }}
          >
            <TraceSidebarActiveSpan
              key={clickedSpan.spanId}
              span={clickedSpan}
            />
          </div>
        ) : null}
        {hoveredSpanId ? (
          <TraceSidebarCursorTooltip
            colorsByServiceName={colorsByServiceName}
            hoveredSpan={hoveredSpan}
            hoveredSpanId={hoveredSpanId}
            totalDurationInNs={totalDurationInNs}
          />
        ) : null}
      </Loader>
    </RightSidebar>
  );
};

export default TraceSidebar;
