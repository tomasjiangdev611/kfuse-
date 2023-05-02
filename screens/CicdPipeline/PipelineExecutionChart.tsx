import { useRequest } from 'hooks';
import React, { ReactElement, useRef } from 'react';
import { EventsChartTimeline } from 'screens/Events/components';
import { EventPageProps } from 'screens/Events/types';

const PipelineExecutionChart = ({
  eventsState,
  eventStackedCountsRequest,
}: EventPageProps & {
  eventStackedCountsRequest: ReturnType<typeof useRequest>;
}): ReactElement => {
  const elementRef = useRef<HTMLDivElement>();

  return (
    <div>
      <EventsChartTimeline
        chartHeight={100}
        defaultColor="#c3e29c"
        elementRef={elementRef}
        isLoadingLogCounts={eventStackedCountsRequest.isLoading}
        timeline={
          eventStackedCountsRequest.result || {
            bars: [],
            eventLevels: [],
            labels: [],
          }
        }
        setDate={eventsState.setDate}
      />
    </div>
  );
};

export default PipelineExecutionChart;
