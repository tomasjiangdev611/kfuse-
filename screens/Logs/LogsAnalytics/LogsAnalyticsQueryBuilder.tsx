import { LogsMetricsQueryBuilder } from 'components';
import { useLogsMetricsQueryBuilderState } from 'hooks';
import React, { ReactElement } from 'react';

import { useLogsState } from '../hooks';

const LogsAnalyticsQueryBuilder = ({
  logsMetricsQueryBuilderState,
  logsState,
}: {
  logsMetricsQueryBuilderState: ReturnType<
    typeof useLogsMetricsQueryBuilderState
  >;
  logsState: ReturnType<typeof useLogsState>;
}): ReactElement => {
  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
  } = logsState;

  return (
    <div>
      <LogsMetricsQueryBuilder
        allowMultipleQueries={true}
        date={date}
        enableVectorAggregates={true}
        filterByFacets={filterByFacets}
        filterOrExcludeByFingerprint={filterOrExcludeByFingerprint}
        keyExists={keyExists}
        logsMetricsQueryBuilderState={logsMetricsQueryBuilderState}
        searchTerms={searchTerms}
        selectedFacetValues={selectedFacetValues}
      />
      <button
        className="button button--blue"
        onClick={logsMetricsQueryBuilderState.addQuery}
      >
        Add Query
      </button>
    </div>
  );
};

export default LogsAnalyticsQueryBuilder;
