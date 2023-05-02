import { useToastmasterContext } from 'components/Toasts';
import { useMetricsQueryState, useRequest } from 'hooks';
import { debounce } from 'lodash';
import React, { ReactElement, useEffect } from 'react';
import { promqlQuery } from 'requests';
import { ExplorerQueryProps, FormulaProps } from 'types/MetricsQueryBuilder';
import { convertNumberToReadableUnit } from 'utils/formatNumber';

import { getPromqlForQueryAndFormula } from '../../utils';

const QueryValue = ({
  metricsQueryState,
}: {
  metricsQueryState: ReturnType<typeof useMetricsQueryState>;
}): ReactElement => {
  const { addToast } = useToastmasterContext();
  const promqlQueryRequest = useRequest(promqlQuery);
  const { charts, toggleAddFormula, updateQuery } = metricsQueryState;
  const { formulas, queries } = charts[0];

  const handleFormulaAdding = (newFormulas: FormulaProps[]) => {
    if (newFormulas.length > 0 && toggleAddFormula.value === false) {
      toggleAddFormula.on();
      for (let i = 0; i < queries.length; i++) {
        updateQuery(0, i, 'isActive', false);
      }
    }

    if (newFormulas.length === 0 && toggleAddFormula.value === true) {
      toggleAddFormula.off();
      updateQuery(0, 0, 'isActive', true);
    }
  };

  const handleQueryAggregation = (newQueries: ExplorerQueryProps[]) => {
    newQueries.forEach((query: ExplorerQueryProps, index: number) => {
      if (query.labels.length > 0) {
        addToast({
          text: 'Aggregation by labels are not supported for Query Value',
          status: 'error',
        });
        updateQuery(0, index, 'labels', []);
      }
    });
  };

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
    handleFormulaAdding(formulas);
    handleQueryAggregation(queries);
  }, [queries, formulas]);

  const callPromqlQuery = (promql: string[]) => {
    debounce(() => promqlQueryRequest.call({ promqlQueries: promql }), 2000)();
  };

  const value = promqlQueryRequest.result?.[0]?.value[1];

  return (
    <div className="dashboard__widget__query-value">
      {value ? convertNumberToReadableUnit(Number(value), 2) : ''}
    </div>
  );
};

export default QueryValue;
