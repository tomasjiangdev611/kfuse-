import Loader from 'components/Loader';
import RightSidebar from 'components/RightSidebar';
import dayjs from 'dayjs';
import useRequest from 'hooks/useRequest';
import React, { useMemo, useState, useEffect } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import describeTrace from 'requests/describeTrace';
import getTrace from 'requests/getTrace';
import TraceSidebarActiveSpan from 'components/TraceSidebar/TraceSidebarActiveSpan';
import TraceSidebarLatencyTooltip from 'components/TraceSidebar/TraceSidebarLatencyTooltip';
import TraceSidebarMain from 'components/TraceSidebar/TraceSidebarMain';
import { DateSelection } from 'types/DateSelection';
import { Trace } from 'types/generated';
import isSpanRoot from 'utils/isSpanRoot';
import { formatDurationNs } from 'utils/timeNs';

type Props = {
  close: VoidFunction;
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  trace: Trace;
};

const CicdPipelineRightSidebar = ({
  close,
  colorsByServiceName,
  date,
  trace,
}: Props) => {
  const getTraceRequest = useRequest(getTrace);
  const describeTraceRequest = useRequest((args) =>
    describeTrace(args).then(({ spans, traceMetrics }) => ({
      rootSpan: spans.find(isSpanRoot),
      spans,
      traceMetrics,
    })),
  );

  const activeTrace = useMemo(
    () => getTraceRequest.result || trace,
    [getTraceRequest.result],
  );

  const { span, traceId } = activeTrace;
  const rootSpan = describeTraceRequest.result?.rootSpan || null;
  const traceMetrics = describeTraceRequest.result?.traceMetrics || null;

  const spans = useMemo(
    () => describeTraceRequest.result?.spans || [],
    [describeTraceRequest.result],
  );

  const [hoveredSpanId, setHoveredSpanId] = useState<string>(null);
  const [clickedSpanId, setClickedSpanId] = useState<string>(null);
  const activeSpanId = hoveredSpanId || clickedSpanId || null;

  const activeSpan = useMemo(
    () => spans.find((span) => span.spanId === activeSpanId),
    [activeSpanId, describeTraceRequest.result],
  );

  useEffect(() => {
    describeTraceRequest.call({ traceId }).then(({ spans, rootSpan }) => {
      if (rootSpan) {
        setClickedSpanId(rootSpan.spanId);
      }
    });
  }, [date]);

  useEffect(() => {
    getTraceRequest.call({ date, traceId: trace.traceId });
  }, [date, trace]);

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
              ? `${formatDurationNs(
                  rootSpan.endTimeNs - rootSpan.startTimeNs,
                )} Total Duration`
              : null}
          </div>
          <div className="trace-sidebar__time__item">
            {rootSpan ? (
              <TraceSidebarLatencyTooltip
                label="trace"
                percentileSummary={rootSpan.spanDurationPercentiles}
                span={rootSpan}
              />
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
        {traceMetrics ? (
          <TraceSidebarMain
            colorsByServiceName={colorsByServiceName}
            setClickedSpanId={setClickedSpanId}
            setHoveredSpanId={setHoveredSpanId}
            spans={spans}
            traceMetrics={traceMetrics}
          />
        ) : null}
        {activeSpan ? (
          <TraceSidebarActiveSpan key={activeSpan.spanId} span={activeSpan} />
        ) : (
          <div className="trace-sidebar__body__placeholder">
            Hover or click on a span to see more details
          </div>
        )}
      </Loader>
    </RightSidebar>
  );
};

export default CicdPipelineRightSidebar;
