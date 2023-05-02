import { Input, PopoverTriggerV2 } from 'components';
import React, { ReactElement, useEffect, useRef } from 'react';
import { useAlertsCreate, useAlertsCreateConditions } from '../hooks';
import AlertsDetectionPopup from './AlertsDetectionPopup';
import { BsQuestionCircleFill } from 'react-icons/bs';
import {
  ANOMALY_INTERVAL_DESCRIPTION,
  getGlobalHistoryAlertHours,
  getPopoverOffset,
  stepCalculator,
} from '../utils';

const AlertsAnomalyEvaluate = ({
  alertsCreateState,
  conditionsState,
}: {
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
}): ReactElement => {
  const { evaluate, setEvaluate } = alertsCreateState;
  const { anomalyCondition } = conditionsState;
  const functionButtonRef = useRef(null);

  const getDescriptionOfDetection = (description: string) => {
    return (
      <div className="alerts__create__tooltip__description">
        <div>
          <PopoverTriggerV2
            popover={({ close }) => (
              <AlertsDetectionPopup
                title={''}
                message={description}
                close={close}
              />
            )}
            position={getPopoverOffset(
              functionButtonRef.current?.getBoundingClientRect(),
            )}
            offsetY={-2}
          >
            <div ref={functionButtonRef}>
              <BsQuestionCircleFill className="blue-question-circle" />
            </div>
          </PopoverTriggerV2>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const interval = stepCalculator(
      getGlobalHistoryAlertHours(anomalyCondition.globalHistory),
    );
    setEvaluate((prevState) => ({ ...prevState, every: interval }));
  }, [anomalyCondition]);

  return (
    <div>
      <div className="alerts__create__section__header">Evaluation</div>
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">
          Evaluate every
        </div>
        <>
          <div className="alert__create__anomaly__detaction_desciption">
            {getDescriptionOfDetection(ANOMALY_INTERVAL_DESCRIPTION)}
          </div>
          <div className="alerts__create__conditions__item__input">
            <Input
              type="text"
              value={stepCalculator(
                getGlobalHistoryAlertHours(anomalyCondition.globalHistory),
              )}
            />
          </div>
        </>
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

export default AlertsAnomalyEvaluate;
