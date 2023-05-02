import React, { ReactElement, useEffect } from 'react';
import { Layout } from 'react-grid-layout';

import {
  useDashboardState,
  useDashboardModalState,
  useDashboardTemplateState,
} from './hooks';
import { DashboardPanelProps, DashboardPanelType } from './types';
import { getPanelWidgetSize, GRAPH_PANELS } from './utils';
import { WidgetGroup, WidgetMetricsPicker, WidgetText } from './Widgets';

const DashboardPanelModal = ({
  baseWidth,
  close,
  dashboardState,
  dashboardTemplateState,
  layout,
  nestedIndex,
  panel,
  panelType,
}: {
  baseWidth: number;
  close: () => void;
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardTemplateState: ReturnType<typeof useDashboardTemplateState>;
  layout: Layout;
  nestedIndex?: string;
  panel?: DashboardPanelProps;
  panelType: DashboardPanelType;
}): ReactElement => {
  const dashboardModalState = useDashboardModalState(dashboardState.date);

  useEffect(() => {
    const panelSize = getPanelWidgetSize(panelType);
    dashboardModalState.updatePanelAnnotation('gridPos', {
      x: layout.x,
      y: layout.y,
      w: panelSize.w,
      h: panelSize.h,
    });
  }, [layout]);

  return (
    <>
      {GRAPH_PANELS.find((val) => val === panelType) && (
        <div className="dashboard__panel-modal">
          <WidgetMetricsPicker
            baseWidth={baseWidth}
            close={close}
            dashboardState={dashboardState}
            dashboardModalState={dashboardModalState}
            dashboardTemplateState={dashboardTemplateState}
            nestedIndex={nestedIndex}
            panel={panel}
            panelType={panelType}
          />
        </div>
      )}
      {panelType === 'text' && (
        <div className="dashboard__panel-modal">
          <WidgetText
            close={close}
            dashboardState={dashboardState}
            dashboardModalState={dashboardModalState}
            nestedIndex={nestedIndex}
            panelType={panelType}
          />
        </div>
      )}
      {panelType === 'group' && (
        <div className="dashboard__panel-modal dashboard__panel-modal--group">
          <WidgetGroup
            close={close}
            dashboardState={dashboardState}
            dashboardModalState={dashboardModalState}
            panelType={panelType}
          />
        </div>
      )}
    </>
  );
};

export default DashboardPanelModal;
