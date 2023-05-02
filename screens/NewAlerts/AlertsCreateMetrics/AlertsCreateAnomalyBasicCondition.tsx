import { AutocompleteV2, PopoverTriggerV2 } from 'components';
import React, { ReactElement, useRef } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';

import AlertsDetectionPopup from '../components/AlertsDetectionPopup';
import { useAlertsCreateConditions } from '../hooks';
import {
  basicBoundType,
  basicBandType,
  basicWindowType,
  BASIC_BOUNDS_DESCRIPTION,
  BASIC_BAND_DESCRIPTION,
  BASIC_WINDOW_DESCRIPTION,
  getPopoverOffset,
} from '../utils';

const AlertsCreateAnomalyBasicCondition = ({
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
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">Window:</div>
        <div className="alert__create__anomaly__detaction_desciption">
          {getDescriptionOfDetection(BASIC_WINDOW_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setAnomalyCondition({
                ...anomalyCondition,
                window: val,
              })
            }
            options={basicWindowType}
            value={anomalyCondition.window}
          />
        </div>
        <div className="alerts__create__conditions__item__text">Bound:</div>
        <div className="alert__create__anomaly__detaction_desciption">
          {getDescriptionOfDetection(BASIC_BOUNDS_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setAnomalyCondition({
                ...anomalyCondition,
                bound: val,
              })
            }
            options={basicBoundType}
            value={anomalyCondition.bound}
          />
        </div>
        <div className="alerts__create__conditions__item__text">Band:</div>
        <div className="alert__create__anomaly__detaction_desciption">
          {getDescriptionOfDetection(BASIC_BAND_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setAnomalyCondition({
                ...anomalyCondition,
                band: val,
              })
            }
            options={basicBandType}
            value={anomalyCondition.band}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsCreateAnomalyBasicCondition;
