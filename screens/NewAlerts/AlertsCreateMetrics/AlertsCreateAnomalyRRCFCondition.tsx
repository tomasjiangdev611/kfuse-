import { AutocompleteV2, Input, PopoverTriggerV2 } from 'components';
import React, { ReactElement, useRef, useEffect } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';

import AlertsDetectionPopup from '../components/AlertsDetectionPopup';
import { useAlertsCreateConditions } from '../hooks';
import {
  getGlobalHistoryAlertMinutes,
  getGlobalHistoryAlertHours,
  getPopoverOffset,
  globalHistoryType,
  GLOBAL_HISTORY_DESCRIPTION,
  LOCAL_HISTORY_DESCRIPTION,
  localHistoryType,
  SAVE_AS_METRIC_NAME_DESCRIPTION,
  secondaryLocalHistoryType,
} from '../utils';

const AlertsCreateAnomalyRRCFCondition = ({
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

  useEffect(() => {
    let xValue =
      getGlobalHistoryAlertHours(anomalyCondition.globalHistory) * 60;
    xValue = Math.pow(2, Math.round(Math.log2(xValue)));
    let yValue = getGlobalHistoryAlertMinutes(anomalyCondition.localHistory);
    yValue = (256 / xValue) * yValue;
    setAnomalyCondition({ ...anomalyCondition, x: xValue.toString() });
    setAnomalyCondition({ ...anomalyCondition, y: yValue.toString() });
    setAnomalyCondition({
      ...anomalyCondition,
      step: ((xValue / 256) * 60).toString(),
    });
  }, [
    anomalyCondition.globalHistory,
    anomalyCondition.localHistory,
    anomalyCondition.step,
  ]);

  return (
    <div>
      <div className="alerts__create__section__item">
        <div className="alerts__create__conditions__item__text">
          Global History:
        </div>
        <div className="alert__create__anomaly__detaction_desciption">
          {getDescriptionOfDetection(GLOBAL_HISTORY_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setAnomalyCondition({
                ...anomalyCondition,
                globalHistory: val,
              })
            }
            options={globalHistoryType}
            value={anomalyCondition.globalHistory}
          />
        </div>
        <div className="alerts__create__conditions__item__text">
          Local History:
        </div>
        <div className="alert__create__anomaly__detaction_desciption">
          {getDescriptionOfDetection(LOCAL_HISTORY_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__item__input">
          <AutocompleteV2
            onChange={(val: string) =>
              setAnomalyCondition({
                ...anomalyCondition,
                localHistory: val,
              })
            }
            options={
              anomalyCondition.globalHistory == 'now-2h'
                ? secondaryLocalHistoryType
                : localHistoryType
            }
            value={anomalyCondition.localHistory}
          />
        </div>
        <div className="alerts__create__change__item__text">
          Save as <span className="text--red"> *</span>
        </div>
        <div className="alert__create__anomaly__detaction_desciption">
          {getDescriptionOfDetection(SAVE_AS_METRIC_NAME_DESCRIPTION)}
        </div>
        <div className="alerts__create__conditions__item__input">
          <Input
            onChange={(val) =>
              setAnomalyCondition((prevState) => ({
                ...prevState,
                metricName: val,
              }))
            }
            placeholder="Metric Name"
            type="text"
            value={anomalyCondition.metricName}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsCreateAnomalyRRCFCondition;
