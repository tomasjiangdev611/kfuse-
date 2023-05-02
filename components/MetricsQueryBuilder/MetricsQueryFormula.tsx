import classNames from 'classnames';
import { Input, TooltipTrigger } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement } from 'react';
import { XCircle } from 'react-feather';
import { validateArithmeticFormulas } from 'utils/MetricsQueryBuilder';
import { ExplorerQueryProps, FormulaProps } from 'types/MetricsQueryBuilder';

const MetricsQueryFormula = ({
  formulas,
  queries,
  metricsQueryState,
}: {
  formulas: FormulaProps[];
  queries: ExplorerQueryProps[];
  metricsQueryState: ReturnType<typeof useMetricsQueryStateV2>;
}): ReactElement => {
  const { handleEnableDisableQuery, removeFormula, updateFormula } =
    metricsQueryState;
  const queryKeys = queries.map((query) => query.queryKey);

  if (!formulas.length) {
    return null;
  }

  return (
    <div>
      {formulas.map((formula: FormulaProps, index: number) => {
        const isFormulaValid = validateArithmeticFormulas(
          formula.expression,
          queryKeys,
        );

        return (
          <div key={index} className="metrics__query-builder__formula">
            <div className="metrics__query-builder__formula__item">
              <div
                className={classNames({
                  'metrics__query-builder__query-item__query-key': true,
                  'metrics__query-builder__query-item__query-key--inactive':
                    !formula.isActive,
                })}
                onClick={() => handleEnableDisableQuery(index, 'formula')}
              >
                {index + 1}
              </div>
              <Input
                className={classNames({
                  'metrics__query-builder__formula__item__input': true,
                  'metrics__query-builder__formula__item__input--invalid':
                    !isFormulaValid,
                })}
                placeholder="Add formula example - 2*a"
                onChange={(val) => updateFormula(index, 'expression', val)}
                value={formula.expression}
                type="text"
              />
            </div>
            <div className="metrics__query-builder__query-action">
              <TooltipTrigger tooltip="Delete">
                <div className="metrics__query-builder__query-action__icon">
                  <div className="metrics__query-builder__query-action__icon--delete">
                    <XCircle onClick={() => removeFormula(index)} />
                  </div>
                </div>
              </TooltipTrigger>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsQueryFormula;
