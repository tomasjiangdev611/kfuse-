import { AutocompleteV2, AutocompleteOption, Input } from 'components';
import React, { ReactElement } from 'react';

import { useAlertsCreateConditions } from '../hooks';
import { conditionByLabel, conditionForReducerLabel } from '../utils';

const AlertsCreateConditions = ({
  alertType,
  conditionsState,
  queryAndFormulaKeysLabel,
  ruleType,
}: {
  alertType?: string;
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
  queryAndFormulaKeysLabel: AutocompleteOption[];
  ruleType: string;
}): ReactElement => {
  const { conditions, updateCondition } = conditionsState;

  return (
    <div>
      <div className="alerts__create__section__header">Condition</div>
      {conditions.map((condition, index) => {
        return (
          <div key={index} className="alerts__create__section__item">
            <div className="alerts__create__conditions__item__text">
              Trigger when
            </div>
            <div className="alerts__create__conditions__item__input">
              <AutocompleteV2
                onChange={(val) => updateCondition(index, 'when', val)}
                options={conditionForReducerLabel}
                value={condition.when}
              />
            </div>
            <div className="alerts__create__conditions__item__text">
              evaluated value {ruleType === 'metrics' ? 'of' : ''}{' '}
            </div>

            {queryAndFormulaKeysLabel.length > 0 && (
              <div className="alerts__create__conditions__item__input">
                <AutocompleteV2
                  onChange={(val) => updateCondition(index, 'queryKey', val)}
                  options={queryAndFormulaKeysLabel}
                  placeholder=""
                  value={condition.queryKey}
                />
              </div>
            )}
            <div className="alerts__create__change__item__text">is</div>
            <div className="alerts__create__conditions__item__input">
              <AutocompleteV2
                onChange={(val) => updateCondition(index, 'of', val)}
                options={conditionByLabel}
                placeholder=""
                value={condition.of}
              />
            </div>

            {['lt', 'gt', 'eq', 'neq'].includes(condition.of) && (
              <>
                <div className="alerts__create__change__item__text">than</div>
                <div className="alerts__create__conditions__item__input">
                  <Input
                    onChange={(val) => updateCondition(index, 'value', val)}
                    placeholder="Threshold Value"
                    type="text"
                    value={condition.value}
                  />
                  {condition.valueError && (
                    <p className="text--red">{condition.valueError}</p>
                  )}
                </div>
              </>
            )}
            {['outside_range', 'inside_range'].includes(condition.of) && (
              <>
                <div className="alerts__create__conditions__item__input">
                  <Input
                    onChange={(val) =>
                      updateCondition(index, 'valueRangeMin', val)
                    }
                    placeholder="From"
                    type="text"
                    value={condition.valueRange.min}
                  />
                </div>
                <div className="alerts__create__conditions__item__input">
                  <Input
                    onChange={(val) =>
                      updateCondition(index, 'valueRangeMax', val)
                    }
                    placeholder="To"
                    type="text"
                    value={condition.valueRange.max}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AlertsCreateConditions;
