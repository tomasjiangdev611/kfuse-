import { LeftSidebar, TooltipTrigger, useLeftSidebarState } from 'components';
import React, { ReactElement } from 'react';
import { Maximize2 } from 'react-feather';
import { BsPlus } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { PanelPosition } from 'types/panel';

import { useSLOState } from './hooks';
import { SLOSidebar } from './SLOSidebar';
import { SLOList } from './SLOList';

const SLOs = (): ReactElement => {
  const navigate = useNavigate();
  const sloState = useSLOState();
  const leftSidebarState = useLeftSidebarState('services');

  const navigateToCreateSLO = () => {
    navigate('/apm/slo/create');
  };

  return (
    <div className="slos">
      <LeftSidebar
        className="slos__left-sidebar"
        leftSidebarState={leftSidebarState}
      >
        <SLOSidebar sloState={sloState} />
      </LeftSidebar>
      <div className="slos__main">
        <div className="slos__header">
          <div className="slos__header__left">
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
            <div className="slos__header__title">SLOs</div>
          </div>
          <button className="button button--blue" onClick={navigateToCreateSLO}>
            <BsPlus size={20} />
            New SLO
          </button>
        </div>
        <SLOList sloState={sloState} />
      </div>
    </div>
  );
};

export default SLOs;
