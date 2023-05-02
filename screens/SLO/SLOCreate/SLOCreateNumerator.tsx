import { MetricsQueryBuilder } from 'components';
import React, { ReactElement } from 'react';

import { useCreateSLOState } from '../hooks';
import SLOCreateBuilderThresold from './SLOCreateBuilderThreshold';

const SLOCreateNumerator = ({
  createSLOState,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const { numeratorQueryState } = createSLOState;
  const { formulas, queries } = numeratorQueryState;

  const firstMetric = queries[0]?.metric || '';
  return (
    <div className="slo__create__source--nume">
      <p>Error events (numerator)</p>

      <MetricsQueryBuilder
        blockedFunctionsCategories={['Aggregation', 'Rank']}
        ComponentAfterFrom={
          firstMetric === 'span_latency_ms_bucket' && (
            <SLOCreateBuilderThresold
              createSLOState={createSLOState}
              type="numerator"
            />
          )
        }
        metricsQueryState={numeratorQueryState}
      />
      {queries.length > 1 || formulas.length > 0 ? (
        <p className="slo__create__source__warn-text">
          The SLO will be calculated based on the first active query or formula.
        </p>
      ) : null}
    </div>
  );
};

export default SLOCreateNumerator;
