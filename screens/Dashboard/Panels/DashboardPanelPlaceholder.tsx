import React, { ReactElement } from 'react';
import { Plus } from 'react-feather';

import { useDashboardState } from '../hooks';

const DashboardPanelPlaceholder = ({
  dashboardState,
}: {
  dashboardState: ReturnType<typeof useDashboardState>;
}): ReactElement => {
  const { isRightSidebarOpenToggle } = dashboardState;

  return (
    <div
      className="dashboard__add-panel"
      onClick={() => {
        if (!isRightSidebarOpenToggle.value) {
          isRightSidebarOpenToggle.on();
        }
      }}
    >
      {isRightSidebarOpenToggle.value ? (
        <div>Drag and drop widget</div>
      ) : (
        <div>
          <Plus />
          Add Widgets
        </div>
      )}
    </div>
  );
};

export default DashboardPanelPlaceholder;
