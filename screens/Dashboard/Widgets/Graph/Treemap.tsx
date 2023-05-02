import { TreemapGraph } from 'components/Chart';
import { useMetricsQueryState, useRequest } from 'hooks';
import { debounce } from 'lodash';
import React, { ReactElement, useEffect } from 'react';
import { promqlQuery } from 'requests';
import { ExplorerQueryProps } from 'types';

import { getPromqlForQueryAndFormula } from '../../utils';

const Treemap = ({
  metricsQueryState,
}: {
  metricsQueryState: ReturnType<typeof useMetricsQueryState>;
}): ReactElement => {
  const promqlQueryRequest = useRequest(promqlQuery);
  const { charts } = metricsQueryState;
  const { formulas, queries } = charts[0];
  useEffect(() => {
    const { formulas, queries } = charts[0];
    const { promqlFormulas, promqlQueries } = getPromqlForQueryAndFormula(
      queries,
      formulas,
    );

    if (promqlFormulas.length > 0) {
      promqlQueryRequest.call({ promqlQueries: promqlFormulas });
      callPromqlQuery(promqlFormulas);
    } else {
      const activeIndex = queries.findIndex(
        (query: ExplorerQueryProps) => query.isActive,
      );
      const activePromql = promqlQueries[activeIndex];
      callPromqlQuery([activePromql]);
    }
  }, [queries, formulas]);

  const callPromqlQuery = (promql: string[]) => {
    debounce(
      () =>
        promqlQueryRequest.call({
          labels: charts[0].queries[0].labels,
          promqlQueries: promql,
          responseFormat: 'piechart',
        }),
      2000,
    )();
  };

  return (
    <div>
      {promqlQueryRequest.result && (
        <TreemapGraph
          data={promqlQueryRequest.result.data || []}
          height={340}
          width={document.body.clientWidth - 100}
        />
      )}
    </div>
  );
};

export default Treemap;
