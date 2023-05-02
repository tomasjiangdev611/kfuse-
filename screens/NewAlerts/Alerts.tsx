import {
  LeftSidebar,
  TooltipTrigger,
  useLeftSidebarState,
  usePopoverContext,
} from 'components';
import React, { useEffect, useRef } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Maximize2 } from 'react-feather';
import { PanelPosition } from 'types';

import AlertsList from './AlertsList';
import AlertstSidebar from './AlertsSidebar';
import { useAlertsState } from './hooks';

const NewAlertsPanel = ({
  close,
  navigate,
}: {
  close: () => void;
  navigate: NavigateFunction;
}) => {
  return (
    <div className="alerts__create__new-alert-panel">
      <div
        onClick={() => {
          navigate(
            `/alerts/create?alertType=${encodeURI(
              JSON.stringify({ value: 'metrics' }),
            )}`,
          );
          close();
        }}
      >
        Metric
      </div>
      <div
        onClick={() => {
          navigate(
            `/alerts/create?alertType=${encodeURI(
              JSON.stringify({ value: 'logs' }),
            )}`,
          );
          close();
        }}
      >
        Log
      </div>
    </div>
  );
};

const Alerts = () => {
  const popover = usePopoverContext();
  const alertsState = useAlertsState();
  const leftSidebarState = useLeftSidebarState('alerts');
  const navigate = useNavigate();
  const newAlertButtonRef = useRef(null);

  const { reloadAlerts } = alertsState;

  const onNewAlertClick = () => {
    popover.open({
      component: NewAlertsPanel,
      element: newAlertButtonRef.current,
      props: { close: popover.close, navigate },
      popoverPanelClassName: 'alerts__create-button__popover-panel',
    });
  };

  useEffect(() => {
    reloadAlerts();
  }, []);

  return (
    <div className="alerts">
      <LeftSidebar
        className="alerts__left-sidebar"
        leftSidebarState={leftSidebarState}
      >
        <AlertstSidebar alertsState={alertsState} />
      </LeftSidebar>
      <div className="alerts__main">
        <div className="alerts__header">
          <div className="alerts__header__left">
            {leftSidebarState.width === 0 ? (
              <TooltipTrigger
                className="logs__search__show-filters-button"
                position={PanelPosition.TOP_LEFT}
                tooltip="Show Filters"
              >
                <button
                  className="button button--icon"
                  onClick={leftSidebarState.show}
                >
                  <Maximize2 size={12} />
                </button>
              </TooltipTrigger>
            ) : null}
            <div className="alerts__header__title">Alerts</div>
          </div>
          <button
            className="button button--blue"
            onClick={onNewAlertClick}
            ref={newAlertButtonRef}
          >
            Create New Alert
          </button>
        </div>
        <AlertsList alertsState={alertsState} />
      </div>
    </div>
  );
};

export default Alerts;
