import { PopoverPosition, PopoverTriggerV2 } from 'components';
import classNames from 'classnames';
import React, { ReactElement, useRef } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { AlertsDetectionPopup } from '../components';
import {
  CHANGE_MESSAGE,
  CHANGE_TITLE,
  CHANGE_DESCRIPTION,
  OUTLIERS_MESSAGE,
  OUTLIERS_TITLE,
  OUTLIERS_DESCRIPTION,
  THRESHOLD_MESSAGE,
  THRESHOLD_TITLE,
  THRESHOLD_DESCRIPTION,
  ANOMALY_MESSAGE,
  ANOMALY_TITLE,
  ANOMALY_DESCRIPTION,
} from '../utils';

const getPopoverOffset = (rect: DOMRect): PopoverPosition => {
  if (rect && rect.left > document.body.clientWidth / 2) {
    return PopoverPosition.BOTTOM_RIGHT;
  }
  return PopoverPosition.BOTTOM_LEFT;
};

type Props = {
  selectedAlertType: string;
  handleTabClick: (tab: string) => void;
};

const AlertsCreateMetricsDetection = ({
  selectedAlertType,
  handleTabClick,
}: Props): ReactElement => {
  const functionButtonRef = useRef(null);

  const getItems = () => {
    const result = [
      {
        key: 'threshold',
        isActive:
          selectedAlertType === undefined || selectedAlertType === 'threshold',
        label: 'Threshold Alert',
        onClick: () => {
          handleTabClick('threshold');
        },
      },
      {
        key: 'change',
        isActive: selectedAlertType === 'change',
        label: 'Change Alert',
        onClick: () => {
          handleTabClick('change');
        },
      },
      {
        key: 'outliers',
        isActive: selectedAlertType === 'outliers',
        label: 'Outliers Alert',
        onClick: () => {
          handleTabClick('outliers');
        },
      },
      {
        key: 'anomaly',
        isActive: selectedAlertType === 'anomaly',
        label: 'Anomaly Detection',
        onClick: () => {
          handleTabClick('anomaly');
        },
      },
    ];
    return result;
  };

  const items = getItems();

  const getDescriptionOfDetection = () => {
    const detectionDescriptions = {
      threshold: {
        message: THRESHOLD_MESSAGE,
        title: THRESHOLD_TITLE,
        description: THRESHOLD_DESCRIPTION,
      },
      change: {
        message: CHANGE_MESSAGE,
        title: CHANGE_TITLE,
        description: CHANGE_DESCRIPTION,
      },
      outliers: {
        message: OUTLIERS_MESSAGE,
        title: OUTLIERS_TITLE,
        description: OUTLIERS_DESCRIPTION,
      },
      anomaly: {
        message: ANOMALY_MESSAGE,
        title: ANOMALY_TITLE,
        description: ANOMALY_DESCRIPTION,
      },
    };

    const { message, title, description } =
      detectionDescriptions[selectedAlertType];

    return (
      <div className="alerts__create__tab__description">
        {description}
        <div>
          <PopoverTriggerV2
            popover={({ close }) => (
              <AlertsDetectionPopup
                title={title}
                message={message}
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
      <div className="alerts__create__metrics__detection__tabs">
        {items.map((item) => (
          <button
            className={classNames({
              alerts__tabs__item: true,
              'alerts__tabs__item--active': item.isActive,
            })}
            key={item.key}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="alert__create__metrics__detaction_desciption">
        {getDescriptionOfDetection()}
      </div>
    </div>
  );
};

export default AlertsCreateMetricsDetection;
