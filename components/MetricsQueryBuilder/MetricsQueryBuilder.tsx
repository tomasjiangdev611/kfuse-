import classNames from 'classnames';
import { TooltipTrigger, useToastmasterContext } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement } from 'react';
import { Code, XCircle } from 'react-feather';
import { MdTune } from 'react-icons/md';
import { ExplorerQueryProps } from 'types/MetricsQueryBuilder';
import {
  buildPromqlWithFunctions,
  decodePromqlToReadable,
  parsePromqlAndBuildQuery,
} from 'utils';

import MetricsQueryBuilderCustomStep from './MetricsQueryBuilderCustomStep';
import MetricsQueryBuilderInput from './MetricsQueryBuilderInput';
import MetricsQueryBuilderMetric from './MetricsQueryBuilderMetric';
import MetricsQueryBuilderSeries from './MetricsQueryBuilderSeries';
import MetricsQueryBuilderFunctions from './MetricsQueryBuilderFunctions';

const MetricsQueryBuilder = ({
  blockedFunctionsCategories = [],
  editableMetrics,
  queries,
  metricsQueryState,
  ComponentAfterFrom,
}: {
  blockedFunctionsCategories?: string[];
  editableMetrics: boolean;
  queries: ExplorerQueryProps[];
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
  ComponentAfterFrom?: ReactElement;
}): ReactElement => {
  const { addToast } = useToastmasterContext();
  const {
    date,
    handleEnableDisableQuery,
    removeQuery,
    updateQuery,
    updateParsedQuery,
  } = metricsQueryState;

  const handleEditPromql = (query: ExplorerQueryProps, queryIndex: number) => {
    if (!query.showInput) {
      const promql = decodePromqlToReadable(buildPromqlWithFunctions(query));
      updateQuery(queryIndex, 'showInput', true);
      updateQuery(queryIndex, 'promql', promql);
    } else {
      const { queries } = parsePromqlAndBuildQuery([query.promql]);
      if (queries.length > 0) {
        const { metric, series, functions } = queries[0];
        updateParsedQuery(queryIndex, metric, functions, series);
        updateQuery(queryIndex, 'showInput', false);
      } else {
        addToast({ status: 'error', text: 'Failed to parse promql' });
      }
    }
  };

  return (
    <>
      {queries.map((query: ExplorerQueryProps, index: number) => {
        return (
          <div key={query.queryKey} className="metrics__query-builder">
            {query.showInput ? (
              <MetricsQueryBuilderInput
                metricsQueryState={metricsQueryState}
                query={query}
                queryIndex={index}
              />
            ) : (
              <div className="metrics__query-builder__query-item">
                <div
                  className="metrics__query-builder__query-item__box"
                  style={{
                    width: Math.max(200, query.metric.length * 7.5 + 32),
                  }}
                >
                  <div
                    className={classNames({
                      'metrics__query-builder__query-item__query-key': true,
                      'metrics__query-builder__query-item__query-key--inactive':
                        !query.isActive,
                    })}
                    onClick={() => handleEnableDisableQuery(index, 'query')}
                  >
                    {query.queryKey}
                  </div>
                  <MetricsQueryBuilderMetric
                    editableMetrics={editableMetrics}
                    metric={query.metric}
                    queryIndex={index}
                    metricsQueryState={metricsQueryState}
                  />
                </div>
                <div className="metrics__query-builder__query-item__box">
                  <div className="metrics__query-builder__query-item__from">
                    From
                  </div>
                  <MetricsQueryBuilderSeries
                    metricName={query.metric}
                    queryIndex={index}
                    metricsQueryState={metricsQueryState}
                    series={query.series}
                  />
                </div>
                {ComponentAfterFrom && (
                  <div className="metrics__query-builder__query-item__box">
                    {ComponentAfterFrom}
                  </div>
                )}

                <div className="metrics__query-builder__query-item__box__function">
                  <MetricsQueryBuilderFunctions
                    blockedFunctionsCategories={blockedFunctionsCategories}
                    query={query}
                    queryIndex={index}
                    metricsQueryState={metricsQueryState}
                  />
                </div>
              </div>
            )}
            <div className="metrics__query-builder__query-action">
              <MetricsQueryBuilderCustomStep
                date={date}
                metricsQueryState={metricsQueryState}
                query={query}
                queryIndex={index}
              />
              <TooltipTrigger
                tooltip={query.showInput ? 'Show Builder' : 'Show Promql'}
              >
                <div className="metrics__query-builder__query-action__icon">
                  <div className="metrics__query-builder__query-action__icon--code">
                    {query.showInput ? (
                      <MdTune onClick={() => handleEditPromql(query, index)} />
                    ) : (
                      <Code onClick={() => handleEditPromql(query, index)} />
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              {queries.length > 1 && (
                <TooltipTrigger tooltip="Delete">
                  <div className="metrics__query-builder__query-action__icon">
                    <div className="metrics__query-builder__query-action__icon--delete">
                      <XCircle onClick={() => removeQuery(index)} />
                    </div>
                  </div>
                </TooltipTrigger>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MetricsQueryBuilder;
