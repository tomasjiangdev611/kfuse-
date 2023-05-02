import { ChartRenderer, SizeObserver } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { eventStackedCounts } from 'requests';
import { queryRangeTimeDurationV2 } from 'utils';

import { EventPageProps } from '../types';

const EventsExplorerChart = ({ eventsState }: EventPageProps): ReactElement => {
  const eventStackedCountsRequest = useRequest(eventStackedCounts);
  const { date, filterByFacets, searchTerms, selectedFacetValuesByNameState } =
    eventsState;

  useEffect(() => {
    const { startTimeUnix, endTimeUnix } = date;
    const rollUp = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix);
    eventStackedCountsRequest.call({
      date,
      filterByFacets,
      groupBys: ['alert_type'],
      rollUp: `${rollUp}s`,
      searchTerms,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
    });
  }, [date, filterByFacets, searchTerms, selectedFacetValuesByNameState.state]);

  return (
    <SizeObserver>
      {({ width }) => (
        <ChartRenderer
          date={eventsState.date}
          chartData={
            eventStackedCountsRequest.result || { data: [], series: [] }
          }
          chartTypes={['Stacked Bar']}
          isLoading={eventStackedCountsRequest.isLoading}
          tooltipType="compact"
          size={{ width: width - 16, height: 140 }}
          styles={{ boxShadow: false }}
          unit="number"
        />
      )}
    </SizeObserver>
  );
};

export default EventsExplorerChart;
