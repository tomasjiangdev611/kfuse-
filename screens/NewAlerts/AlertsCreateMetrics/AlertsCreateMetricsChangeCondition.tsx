import { AutocompleteV2, AutocompleteOption, Input } from 'components';
import React from 'react';

import { useAlertsCreateConditions } from '../hooks';
import {
  changeType,
  conditionForReducerLabel,
  conditionByLabel,
  timeType,
} from '../utils';

function AlertsCreateMetricsChangeCondition({
  queryAndFormulaKeysLabel,
  conditionsState,
}: {
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
  queryAndFormulaKeysLabel: AutocompleteOption[];
}): JSX.Element {
  const {
    conditions,
    metricsChangeCondition,
    setMetricsChangeCondition,
    updateCondition,
  } = conditionsState;

  const changeCondition = metricsChangeCondition;
  const condition = conditions[0];
  return (
    <div>
      <div className="alerts__create__section__header">Condition</div>
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">
          Trigger when
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) => updateCondition(0, 'when', val)}
            options={conditionForReducerLabel}
            value={condition.when}
          />
        </div>
        <div className="alerts__create__change__item__text">of</div>
        <div className="alerts__create__change__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setMetricsChangeCondition({ ...changeCondition, change: val })
            }
            options={changeType}
            value={changeCondition.change}
          />
        </div>
        {queryAndFormulaKeysLabel.length > 0 && (
          <>
            <div className="alerts__create__change__item__text">of</div>
            <div className="alerts__create__conditions__item__input">
              <AutocompleteV2
                onChange={(val: string) => updateCondition(0, 'queryKey', val)}
                options={queryAndFormulaKeysLabel}
                placeholder=""
                value={condition.queryKey}
              />
            </div>
          </>
        )}

        <div className="alerts__create__change__item__text">from</div>
        <div className="alerts__create__change__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setMetricsChangeCondition({ ...changeCondition, time: val })
            }
            options={timeType}
            value={changeCondition.time}
          />
        </div>
        <div className="alerts__create__change__item__text">ago over</div>
        <div className="alerts__create__change__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setMetricsChangeCondition({
                ...changeCondition,
                comparedTime: val,
              })
            }
            options={timeType}
            value={changeCondition.comparedTime}
          />
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) => updateCondition(0, 'of', val)}
            options={conditionByLabel}
            placeholder=""
            value={condition.of}
          />
        </div>

        {['lt', 'gt'].includes(condition.of) && (
          <>
            <div className="alerts__create__change__item__text">than</div>
            <div className="alerts__create__conditions__item__input">
              <Input
                onChange={(val) => updateCondition(0, 'value', val)}
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
      </div>
    </div>
  );
}

export default AlertsCreateMetricsChangeCondition;
