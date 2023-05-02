import { AutocompleteV2, PopoverTriggerV2 } from 'components';
import React, { ReactElement, useRef } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';

import { AlertsDetectionPopup } from '../components';
import { useAlertsCreateConditions } from '../hooks';
import {
  anomalyAlgorithmType,
  BASIC_ALGORITHM_DESCRIPTION,
  getPopoverOffset,
  RRCF_ALGORITHM_DESCRIPTION,
} from '../utils';

const AlertsCreateAnomalyCondition = ({
  conditionsState,
}: {
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
}): ReactElement => {
  const { anomalyCondition, setAnomalyCondition } = conditionsState;
  const functionButtonRef = useRef(null);

  const getDescriptionOfDetection = (description: string) => {
    return (
      <div className="alerts__create__tab__description">
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

  return (
    <div>
      <div className="alerts__create__section__header">
        Anomaly algorithm options
      </div>
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">
          Using Algorithm
        </div>
        <div className="alert__create__anomaly__detaction_desciption">
          {anomalyCondition.anomalyAlgorithm == 'rrcf'
            ? getDescriptionOfDetection(RRCF_ALGORITHM_DESCRIPTION)
            : getDescriptionOfDetection(BASIC_ALGORITHM_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__algorithm">
          <AutocompleteV2
            onChange={(val: string) =>
              setAnomalyCondition({
                ...anomalyCondition,
                anomalyAlgorithm: val,
              })
            }
            options={anomalyAlgorithmType}
            value={anomalyCondition.anomalyAlgorithm}
            placeholder={'Select Group'}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsCreateAnomalyCondition;
