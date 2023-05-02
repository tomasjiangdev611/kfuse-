import { AutocompleteV2, Loader, MultiselectV2 } from 'components';
import { useRequest, useUrlState } from 'hooks';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { components } from 'react-select';
import { eventStackedCounts } from 'requests';
import { queryRangeTimeDurationV2 } from 'utils';

import { EventPageProps } from '../types';
import {
  eventsCoreLabels,
  getLabelsOptions,
  getEventsFacetOptions,
  rollupOptions,
  TopKoptions,
} from '../utils';
import EventsAnalyticsQueryChart from './EventsAnalyticsQueryChart';
import EventsAnalyticsQueryTable from './EventsAnalyticsQueryTable';
import EventsAnalyticsQueryTopList from './EventsAnalyticsQueryTopList';

const VISUALIZATION_TYPES = [
  { label: 'Table', value: 'table' },
  { label: 'Top List', value: 'top-list' },
  { label: 'Timeseries', value: 'timeseries' },
];

const defaultAnalyticsQuery = {
  countBy: '*',
  groupBy: ['*'],
  rollUp: '5m',
  limitType: 'Top',
  limit: 10,
};

const EventsAnalyticsQuery = ({
  eventsState,
}: EventPageProps): ReactElement => {
  const {
    additionalLabels,
    cloudLabels,
    date,
    filterByFacets,
    kubernetesLabels,
    searchTerms,
    selectedFacetValuesByNameState,
  } = eventsState;
  const eventStackedCountsRequest = useRequest(eventStackedCounts);
  const [analyticsQuery, setAnalyticsQuery] = useUrlState(
    'eventAnalyticsQuery',
    defaultAnalyticsQuery,
  );
  const [visualizationType, setVisualizationType] = useState('timeseries');

  const autocompleteOptions = useMemo(
    () => [
      ...[{ label: '( everything )', value: '*' }],
      ...getEventsFacetOptions(),
      ...getLabelsOptions([
        ...cloudLabels,
        ...kubernetesLabels,
        ...additionalLabels,
      ]),
    ],
    [additionalLabels, cloudLabels, kubernetesLabels],
  );

  const updateAnalyticsQuery = (key: string, value: string | string[]) => {
    setAnalyticsQuery({ ...analyticsQuery, [key]: value });
  };

  useEffect(() => {
    const { countBy, groupBy, limit, limitType, rollUp } = analyticsQuery;
    const isGroupByEverything = groupBy[0] === '*';

    eventStackedCountsRequest.call({
      countUnique: countBy === '*' ? [] : countBy,
      date,
      groupBys: isGroupByEverything ? [] : groupBy,
      filterByFacets,
      returnFormat: visualizationType,
      rollUp: visualizationType === 'timeseries' ? rollUp : null,
      searchTerms,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
      TopOrBottomK: isGroupByEverything ? null : { type: limitType, k: limit },
    });
  }, [
    analyticsQuery,
    date,
    filterByFacets,
    searchTerms,
    selectedFacetValuesByNameState.state,
    visualizationType,
  ]);

  useEffect(() => {
    const { startTimeUnix, endTimeUnix } = date;
    const rollUpFromDate = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix);
    let rollUpNew = '';
    if (rollUpFromDate > 60 * 60) {
      rollUpNew = `${Math.floor(rollUpFromDate / 60 / 60)}h`;
    } else if (rollUpFromDate >= 60) {
      rollUpNew = `${Math.floor(rollUpFromDate / 60)}m`;
    } else {
      rollUpNew = `${rollUpFromDate}s`;
    }

    if (rollUpNew !== analyticsQuery.rollUp) {
      updateAnalyticsQuery('rollUp', rollUpNew);
    }
  }, [date]);

  return (
    <div>
      <div className="events__analytics__query">
        <div className="events__analytics__query-builder">
          <div className="events__analytics__query-builder__item">
            <div className="events__analytics__query__subtitle">
              Count {analyticsQuery.countBy !== '*' ? 'unique' : ''}
            </div>
            <AutocompleteV2
              className="autocomplete-container--no-border events__analytics__query__autocomplete"
              onChange={(val: string) => updateAnalyticsQuery('countBy', val)}
              options={autocompleteOptions}
              value={analyticsQuery.countBy}
            />
            <div className="events__analytics__query__subtitle">Group by</div>
            <MultiselectV2
              className="autocomplete-container--no-border events__analytics__query__autocomplete"
              components={{
                MultiValueLabel: (prop) => {
                  if (prop.data.value === '*') {
                    return (
                      <components.MultiValueLabel {...prop}>
                        everything
                      </components.MultiValueLabel>
                    );
                  }

                  const isCoreLabel = eventsCoreLabels.find(
                    (e) => e.name === prop.data.value,
                  );
                  return (
                    <components.MultiValueLabel {...prop}>
                      {isCoreLabel ? isCoreLabel.label : prop.data.value}
                    </components.MultiValueLabel>
                  );
                },
              }}
              onChange={(val: string[]) => {
                if (val.length === 0) {
                  updateAnalyticsQuery('groupBy', ['*']);
                } else {
                  const newGroupBy = val.filter((v) => v !== '*');
                  updateAnalyticsQuery('groupBy', newGroupBy);
                }
              }}
              options={autocompleteOptions}
              placeholder="Everything"
              value={analyticsQuery.groupBy}
            />
          </div>
          {visualizationType === 'timeseries' && (
            <div className="events__analytics__query-builder__item">
              <div className="events__analytics__query__subtitle">
                roll up every
              </div>
              <AutocompleteV2
                className="autocomplete-container--no-border events__analytics__query__autocomplete"
                onChange={(val: string) => updateAnalyticsQuery('rollUp', val)}
                options={rollupOptions}
                value={analyticsQuery.rollUp}
              />
            </div>
          )}
          <div className="events__analytics__query-builder__item">
            {analyticsQuery.groupBy[0] !== '*' && (
              <>
                <div className="events__analytics__query__subtitle">
                  limit to
                </div>
                <AutocompleteV2
                  className="autocomplete-container--no-border"
                  options={[
                    { label: 'top', value: 'Top' },
                    { label: 'bottom', value: 'Bottom' },
                  ]}
                  value={analyticsQuery.limitType}
                  onChange={(val: string) =>
                    updateAnalyticsQuery('limitType', val)
                  }
                />
                <AutocompleteV2
                  className="autocomplete-container--no-border"
                  options={TopKoptions}
                  value={analyticsQuery.limit}
                  onChange={(val: string) => updateAnalyticsQuery('limit', val)}
                />
              </>
            )}
          </div>
        </div>
        <div className="events__analytics__query__visualization">
          <AutocompleteV2
            options={VISUALIZATION_TYPES}
            value={visualizationType}
            onChange={setVisualizationType}
          />
        </div>
      </div>
      <Loader isLoading={eventStackedCountsRequest.isLoading}>
        {visualizationType === 'timeseries' && (
          <EventsAnalyticsQueryChart
            eventsState={eventsState}
            eventStackedCountsRequest={eventStackedCountsRequest}
          />
        )}
        {visualizationType === 'table' && (
          <EventsAnalyticsQueryTable
            eventStackedCountsRequest={eventStackedCountsRequest}
            groupBy={analyticsQuery.groupBy}
          />
        )}
        {visualizationType === 'top-list' && (
          <EventsAnalyticsQueryTopList
            eventStackedCountsRequest={eventStackedCountsRequest}
          />
        )}
      </Loader>
    </div>
  );
};

export default EventsAnalyticsQuery;
