import { ChartRenderer, SizeObserver } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement } from 'react';

import { EventPageProps } from '../types';

const EventsAnalyticsQueryChart = ({
  eventsState,
  eventStackedCountsRequest,
}: EventPageProps & {
  eventStackedCountsRequest: ReturnType<typeof useRequest>;
}): ReactElement => {
  const isTimeseriesData = eventStackedCountsRequest.result?.series?.length > 0;

  if (!isTimeseriesData) return null;

  return (
    <SizeObserver>
      {({ width }) => (
        <ChartRenderer
          date={eventsState.date}
          chartData={
            eventStackedCountsRequest.result || { data: [], series: [] }
          }
          chartTypes={['Stacked Bar', 'Line', 'Area']}
          isLoading={eventStackedCountsRequest.isLoading}
          legend={{ legendType: 'compact' }}
          size={{ width: width - 16, height: 400 }}
          styles={{ boxShadow: false }}
          toolbar={{ toolbarMenuType: 'dropdown' }}
          tooltipType="compact"
          unit="number"
        />
      )}
    </SizeObserver>
  );
};

export default EventsAnalyticsQueryChart;
