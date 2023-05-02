import React, { ReactElement } from 'react';

type PopupProps = {
  title: string;
  message: string;
  close: () => void;
};

const AlertsDetectionPopup = ({
  title,
  message,
  close,
}: PopupProps): ReactElement => {
  return (
    <div
      className="alerts__metrics__detection-info__popup"
      onMouseLeave={() => close()}
    >
      <h3>{title}</h3>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AlertsDetectionPopup;
