import Datepicker from 'composite/Datepicker';
import React, { ReactElement } from 'react';
import { Check, Plus } from 'react-feather';
import { MdModeEdit } from 'react-icons/md';

import DashboardDetailsModal from './DashboardDetailsModal';
import { useDashboardState } from './hooks';

const DashboardHeader = ({
  hideSidebar,
  dashboardState,
}: {
  dashboardState: ReturnType<typeof useDashboardState>;
  hideSidebar?: boolean;
}): ReactElement => {
  const {
    date,
    dashboardDetails,
    isRightSidebarOpenToggle,
    onDateChange,
    panelSetupModal,
  } = dashboardState;

  const openDashboardDetailsModal = () => {
    panelSetupModal.push(
      <DashboardDetailsModal
        close={() => panelSetupModal.pop()}
        dashboardState={dashboardState}
      />,
    );
  };

  return (
    <div className="dashboard__header">
      <div className="dashboard__header__left">
        <div
          className="dashboard__header__left__title"
          onClick={openDashboardDetailsModal}
        >
          {dashboardDetails.title} <MdModeEdit />
        </div>
        {!hideSidebar && (
          <div className="dashboard__header__left__action">
            {isRightSidebarOpenToggle.value ? (
              <button className="button" onClick={isRightSidebarOpenToggle.off}>
                <Check /> &nbsp; Close
              </button>
            ) : (
              <button className="button" onClick={isRightSidebarOpenToggle.on}>
                <Plus /> Add Widgets
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        <Datepicker
          absoluteTimeRangeStorage={null}
          className="logs__search__datepicker"
          hasStartedLiveTail={false}
          onChange={onDateChange}
          startLiveTail={null}
          value={date}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
