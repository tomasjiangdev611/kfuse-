import { Stepper, Textarea } from 'components';
import React, { ReactElement, useEffect } from 'react';
import { useDashboardState, useDashboardModalState } from '../hooks';

import {
  DashboardPanelModalFooter,
  DashboardPanelModalHeader,
} from '../components';
import { DashboardPanelType } from '../types';

const WidgetText = ({
  close,
  dashboardState,
  dashboardModalState,
  nestedIndex,
  panelType,
}: {
  close: () => void;
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardModalState: ReturnType<typeof useDashboardModalState>;
  nestedIndex?: string;
  panelType: DashboardPanelType;
}): ReactElement => {
  const { panelData, setPanelData } = dashboardModalState;
  const { addPanel } = dashboardState;

  const onSaveTextWidget = () => {
    panelData.type = panelType;
    addPanel(panelData, nestedIndex);
    close();
  };

  useEffect(() => {
    setPanelData((prevState) => ({
      ...prevState,
      options: { ...prevState.options, content: 'Your text to display' },
    }));
  }, []);

  return (
    <div>
      <DashboardPanelModalHeader
        close={close}
        modalDate={null}
        setModalDate={null}
      />
      <div className="dashboard__panel-modal__scrollview dashboard__panel-modal__body">
        <div className="dashboard__widget"></div>
        <Stepper
          steps={[
            {
              title: 'Text to display',
              component: (
                <div>
                  <Textarea
                    onChange={(val) =>
                      setPanelData((prevState) => ({
                        ...prevState,
                        options: { ...prevState.options, content: val },
                      }))
                    }
                    type="text"
                    value={panelData.options?.content}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
      <DashboardPanelModalFooter close={close} onSave={onSaveTextWidget} />
    </div>
  );
};

export default WidgetText;
