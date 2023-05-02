import { Input } from 'components';
import React, { ReactElement } from 'react';

import { useAlertsCreate } from '../hooks';

const AlertsCreateEvaluate = ({
  alertsCreateState,
}: {
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
}): ReactElement => {
  const { evaluate, setEvaluate } = alertsCreateState;

  return (
    <div>
      <div className="alerts__create__section__header">Evaluation</div>
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">
          Evaluate every
        </div>
        <div className="alerts__create__conditions__item__input">
          <Input
            onChange={(val) =>
              setEvaluate((prevState) => ({ ...prevState, every: val }))
            }
            type="text"
            value={evaluate.every}
          />
        </div>
        <div className="alerts__create__conditions__item__text">For</div>
        <div className="alerts__create__conditions__item__input">
          <Input
            onChange={(val) =>
              setEvaluate((prevState) => ({ ...prevState, for: val }))
            }
            type="text"
            value={evaluate.for}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsCreateEvaluate;
