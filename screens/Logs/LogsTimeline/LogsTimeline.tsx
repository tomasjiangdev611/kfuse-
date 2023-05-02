import { SizeObserver } from 'components';
import React from 'react';
import LogsTimelineInner from './LogsTimelineInner';

const LogsTimeline = ({
  hoveredLogDateUnix,
  logsState,
  queryScheduler,
  selectedLog,
  showTimelineToggle,
}) => {
  return (
    <SizeObserver>
      {({ width }) =>
        width ? (
          <LogsTimelineInner
            hoveredLogDateUnix={hoveredLogDateUnix}
            logsState={logsState}
            queryScheduler={queryScheduler}
            selectedLog={selectedLog}
            showTimelineToggle={showTimelineToggle}
            width={width}
          />
        ) : null
      }
    </SizeObserver>
  );
};

export default LogsTimeline;
