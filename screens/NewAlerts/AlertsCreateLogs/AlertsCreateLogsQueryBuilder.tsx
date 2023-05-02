import { LogsMetricsQueryBuilder, SearchBar } from 'components';
import { CoreLabels } from 'constants';
import { useLogsMetricsQueryBuilderState, useRequest } from 'hooks';
import React, { ReactElement, useEffect, useMemo } from 'react';
import { getLabelNames } from 'requests';
import { DateSelection, RequestResult } from 'types';
import { getLabelAndFacetWithDelimiter, groupLabels } from 'utils';

import { useAlertsCreateLogs } from '../hooks';

const AlertsCreateLogsQueryBuilder = ({
  alertsCreateLogsState,
  date,
  logsMetricsQueryBuilderState,
  logMetricsTimeseriesMultipleRequest,
}: {
  alertsCreateLogsState: ReturnType<typeof useAlertsCreateLogs>;
  date: DateSelection;
  logsMetricsQueryBuilderState: ReturnType<
    typeof useLogsMetricsQueryBuilderState
  >;
  logMetricsTimeseriesMultipleRequest: RequestResult;
}): ReactElement => {
  const getLabelNamesRequest = useRequest(getLabelNames);
  const { filterByFacets, searchTerms } = alertsCreateLogsState;
  const { additionalLabels, cloudLabels, kubernetesLabels } = useMemo(
    () => groupLabels(getLabelNamesRequest.result || []),
    [getLabelNamesRequest.result],
  );

  const { queries } = logsMetricsQueryBuilderState;

  useEffect(() => {
    const newQueries = queries.map((query) => {
      return {
        ...query,
        rangeAggregateGrouping: getLabelAndFacetWithDelimiter(
          query.rangeAggregateGrouping,
        ),
        vectorAggregate:
          query.vectorAggregate === 'none' ? '' : query.vectorAggregate,
      };
    });

    logMetricsTimeseriesMultipleRequest.call({
      date,
      filterByFacets,
      queries: newQueries,
      searchTerms,
    });
  }, [date, filterByFacets, queries, searchTerms]);

  return (
    <div>
      <SearchBar
        addSearchFilters={{
          addFilterByFacet: alertsCreateLogsState.addFilterByFacet,
          addSearchTerm: alertsCreateLogsState.addSearchTerm,
        }}
        searchBarState={{
          filterByFacets,
          removeFilterByFacetByIndex:
            alertsCreateLogsState.removeFilterByFacetByIndex,
          removeSearchTermByIndex:
            alertsCreateLogsState.removeSearchTermByIndex,
          searchTerms,
        }}
        date={date}
        labels={{
          additional: additionalLabels,
          cloud: cloudLabels,
          core: CoreLabels,
          kubernetes: kubernetesLabels,
        }}
      />
      <div className="alerts__create__logs__query-builder">
        <LogsMetricsQueryBuilder
          date={date}
          filterByFacets={filterByFacets}
          searchTerms={searchTerms}
          logsMetricsQueryBuilderState={logsMetricsQueryBuilderState}
        />
      </div>
    </div>
  );
};

export default AlertsCreateLogsQueryBuilder;
