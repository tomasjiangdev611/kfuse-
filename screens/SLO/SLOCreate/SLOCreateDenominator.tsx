import { MetricsQueryBuilder } from 'components';
import React, { ReactElement } from 'react';

import { useCreateSLOState } from '../hooks';

const SLOCreateDenominator = ({
  createSLOState,
}: {
  createSLOState: ReturnType<typeof useCreateSLOState>;
}): ReactElement => {
  const { denominatorQueryState } = createSLOState;
  const { formulas, queries } = denominatorQueryState;

  return (
    <div className="slo__create__source--denom">
      <p>Total events (denominator)</p>
      <MetricsQueryBuilder
        blockedFunctionsCategories={['Aggregation', 'Rank']}
        metricsQueryState={denominatorQueryState}
      />
      {queries.length > 1 || formulas.length > 0 ? (
        <p className="slo__create__source__warn-text">
          The SLO will be calculated based on the first active query or formula.
        </p>
      ) : null}
    </div>
  );
};

export default SLOCreateDenominator;
