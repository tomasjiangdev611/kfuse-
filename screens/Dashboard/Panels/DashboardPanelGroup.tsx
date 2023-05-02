import classNames from 'classnames';
import React, { ReactElement } from 'react';

import DashboardPanelRender from '../DashboardPanelRender';
import { DashboardPanelComponentProps } from '../types';

const DashboardPanelGroup = ({
  baseHeight,
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  return (
    <div className={classNames({ 'dashboard-panel__body': true })}>
      <DashboardPanelRender
        baseHeight={baseHeight}
        baseWidth={baseWidth}
        dashboardState={dashboardState}
        dashboardTemplateState={dashboardTemplateState}
        nestedIndex={`${panelIndex}`}
        panels={panel.panels}
      />
    </div>
  );
};

export default DashboardPanelGroup;
