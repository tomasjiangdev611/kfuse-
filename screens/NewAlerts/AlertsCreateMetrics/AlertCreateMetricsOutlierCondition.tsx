import { AutocompleteOption, AutocompleteV2 } from 'components';
import React, { ReactElement } from 'react';
import { OUTLIER_OPTIONS } from 'utils';

import { useAlertsCreateConditions } from '../hooks';
import { toleranceType } from '../utils';

const AlertCreateMetricsOutlierCondition = ({
  conditionsState,
}: {
  alertType: string;
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
  queryAndFormulaKeysLabel: AutocompleteOption[];
}): ReactElement => {
  const { outlierCondition, setOutlierCondition } = conditionsState;
  return (
    <div>
      <div className="alerts__create__section__header">
        Outlier algorithm options
      </div>
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">
          Using Algorithm
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setOutlierCondition({ ...outlierCondition, algorithm: val })
            }
            options={OUTLIER_OPTIONS}
            value={outlierCondition.algorithm}
            placeholder={'Select Group'}
          />
        </div>
        <div className="alerts__create__conditions__item__text">tolerance:</div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setOutlierCondition({ ...outlierCondition, tolerance: val })
            }
            options={toleranceType}
            value={outlierCondition.tolerance}
            placeholder={'Select Group'}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertCreateMetricsOutlierCondition;
