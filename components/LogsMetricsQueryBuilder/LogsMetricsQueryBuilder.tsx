import { useLogsMetricsQueryBuilderState } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { DateSelection } from 'types/DateSelection';

import LogsMetricsQueryBuilderQuery from './LogsMetricsQueryBuilderQuery';

const LogsMetricsQueryBuilder = ({
  allowMultipleQueries = false,
  date,
  enableVectorAggregates = false,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  logsMetricsQueryBuilderState,
  searchTerms,
  selectedFacetValues,
}: {
  allowMultipleQueries?: boolean;
  date: DateSelection;
  enableVectorAggregates?: boolean;
  filterByFacets: string[];
  filterOrExcludeByFingerprint?: string[];
  keyExists?: string[];
  logsMetricsQueryBuilderState: ReturnType<
    typeof useLogsMetricsQueryBuilderState
  >;
  searchTerms: string[];
  selectedFacetValues?: any;
}): ReactElement => {
  const { facetNamesOptions, facetNamesRequest, queries } =
    logsMetricsQueryBuilderState;

  useEffect(() => {
    facetNamesRequest.call({
      date,
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      searchTerms,
      selectedFacetValues,
    });
  }, [
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
  ]);

  return (
    <div className="query-builder__logs">
      {queries.map((query, queryIndex) => {
        return (
          <LogsMetricsQueryBuilderQuery
            allowMultipleQueries={allowMultipleQueries}
            enableVectorAggregates={enableVectorAggregates}
            facetNamesOptions={facetNamesOptions}
            key={queryIndex}
            logsMetricsQueryBuilderState={logsMetricsQueryBuilderState}
            queryIndex={queryIndex}
            query={query}
            queries={queries}
          />
        );
      })}
    </div>
  );
};

export default LogsMetricsQueryBuilder;
