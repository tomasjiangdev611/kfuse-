import { TopList } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement } from 'react';

const EventsAnalyticsQueryTable = ({
  eventStackedCountsRequest,
}: {
  eventStackedCountsRequest: ReturnType<typeof useRequest>;
}): ReactElement => {
  if (!eventStackedCountsRequest.result) return null;

  if (eventStackedCountsRequest.result.series) return null;

  return (
    <div className="events__analytics__query__table">
      <TopList data={eventStackedCountsRequest.result} />
    </div>
  );
};

export default EventsAnalyticsQueryTable;
