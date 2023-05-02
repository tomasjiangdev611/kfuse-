import { TooltipTrigger } from 'components';
import React, { ReactElement } from 'react';
import { MdNotificationAdd } from 'react-icons/md';
import { AiOutlineFullscreen } from 'react-icons/ai';

const MetricsChartsRightToolbar = ({
  onCreateAlert,
  onViewFullscreen,
}: {
  onCreateAlert: () => void;
  onViewFullscreen: () => void;
}): ReactElement => {
  return (
    <div className="new-metrics__chart__right-toolbar">
      {onViewFullscreen && (
        <div
          className="new-metrics__chart__right-toolbar__icon"
          onClick={onViewFullscreen}
        >
          <TooltipTrigger tooltip="View in fullscreen">
            <AiOutlineFullscreen />
          </TooltipTrigger>
        </div>
      )}
    </div>
  );
};

export default MetricsChartsRightToolbar;
