import { Input } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement } from 'react';
import { ExplorerQueryProps } from 'types/MetricsQueryBuilder';

const MetricsQueryBuilderInput = ({
  metricsQueryState,
  query,
  queryIndex,
}: {
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
  query: ExplorerQueryProps;
  queryIndex: number;
}): ReactElement => {
  const { reloadOneQuery, updateQuery } = metricsQueryState;

  return (
    <div className="metrics__query-builder__query-item">
      <div className="metrics__query-builder__query-item__code">
        <div className="metrics__query-builder__query-item__query-key">
          {query.queryKey}
        </div>
        <Input
          className="input--no-border"
          placeholder="Enter promQL query"
          onChange={(val: string) => updateQuery(queryIndex, 'promql', val)}
          value={query.promql}
          type="text"
        />
        <div
          className="button button--blue metrics__query-builder__query-item__code__run"
          onClick={() => {
            reloadOneQuery({
              metricName: query.metric,
              promql: query.promql,
              queryIndex,
              type: 'query',
              step: query.steps,
            });
          }}
        >
          Run
        </div>
      </div>
    </div>
  );
};

export default MetricsQueryBuilderInput;
