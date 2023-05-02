import { Input } from 'components';
import React, { ReactElement } from 'react';
import { useDashboardModalState, useDashboardState } from '../hooks';

import {
  DashboardPanelModalFooter,
  DashboardPanelModalHeader,
} from '../components';
import { DashboardPanelType } from '../types';

const WidgetGroup = ({
  close,
  dashboardState,
  dashboardModalState,
  panelType,
}: {
  close: () => void;
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardModalState: ReturnType<typeof useDashboardModalState>;
  panelType: DashboardPanelType;
}): ReactElement => {
  const { panelData, setPanelData } = dashboardModalState;
  const onSaveGroupWidget = () => {
    panelData.type = panelType;
    panelData.panels = [];
    dashboardState.addPanel(panelData, null);
    close();
  };

  return (
    <>
      <DashboardPanelModalHeader
        close={close}
        modalDate={null}
        setModalDate={null}
      />
      <div className="dashboard__panel-modal__body">
        <div>Give group a name</div>
        <Input
          onChange={(val) =>
            setPanelData((prevState) => ({ ...prevState, title: val }))
          }
          placeholder="Group name"
          type="text"
          value={panelData.title}
        />
      </div>
      <DashboardPanelModalFooter close={close} onSave={onSaveGroupWidget} />
    </>
  );
};

export default WidgetGroup;
