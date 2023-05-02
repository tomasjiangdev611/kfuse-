import classNames from 'classnames';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement } from 'react';
import { Plus } from 'react-feather';

import MetricsQueryBuilder from './MetricsQueryBuilder';
import MetricsQueryFormula from './MetricsQueryFormula';

const Metrics = ({
  blockedFunctionsCategories = [],
  editableMetrics = true,
  metricsQueryState,
  ComponentAfterFrom,
}: {
  blockedFunctionsCategories?: string[];
  editableMetrics?: boolean;
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
  ComponentAfterFrom?: ReactElement;
}): ReactElement => {
  const {
    activeQueryType,
    addFormula,
    addQuery,
    formulas,
    queries,
    toggleAddFormula,
  } = metricsQueryState;

  return (
    <div>
      <div>
        <MetricsQueryBuilder
          blockedFunctionsCategories={blockedFunctionsCategories}
          ComponentAfterFrom={ComponentAfterFrom}
          editableMetrics={editableMetrics}
          queries={queries}
          metricsQueryState={metricsQueryState}
        />
        <MetricsQueryFormula
          formulas={formulas}
          queries={queries}
          metricsQueryState={metricsQueryState}
        />
        <div className="metrics-query-builder__actions">
          <button className="button button--blue" onClick={() => addQuery()}>
            <Plus size={16} /> Add Query
          </button>
          {activeQueryType === 'multi' && (
            <button
              className={classNames({
                'button button--blue': true,
                'button--disabled': toggleAddFormula.value,
              })}
              onClick={() => addFormula()}
            >
              <Plus size={16} /> Add Formula
            </button>
          )}
          {formulas.length === 0 && activeQueryType === 'single' && (
            <button
              className={classNames({
                'button button--blue': true,
                'button--disabled': toggleAddFormula.value,
              })}
              onClick={() => addFormula()}
            >
              <Plus size={16} /> Add Formula
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
