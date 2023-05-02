import classNames from 'classnames';
import { ErrorBoundary } from 'components';
import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react';

import { DashboardPanelNoData } from './components';
import {
  DashboardPanelChart,
  DashboardPanelChartInstant,
  DashboardPanelGroup,
  DashboardPanelFreeText,
  DashboardPanelHeader,
  DashboardPanelPlaceholder,
  DashboardPanelPolyStat,
  DashboardPanelStat,
  DashboardPanelTable,
} from './Panels';
import {
  DashboardPanelComponentProps,
  DashboardPanelType,
  SUPPORTED_PANELS,
} from './types';

const DashboardPanelWrapper = ({
  baseHeight,
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  disableEditPanel,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const [isInView, setIsInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { selectedPanel, updateSelectedPanel } = dashboardState;

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { root: null, rootMargin: '0px', threshold: 0.5 },
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const prop = {
    baseHeight,
    baseWidth,
    dashboardState,
    dashboardTemplateState,
    disableEditPanel,
    isInView,
    panel,
    panelIndex,
    nestedIndex,
  };

  return (
    <div
      className={classNames({
        'dashboard-panel__body': true,
        'dashboard-panel__body--selected':
          selectedPanel.panelIndex === panelIndex &&
          selectedPanel.nestedIndex === nestedIndex,
        'dashboard-panel__body--timeseries':
          panel.type === DashboardPanelType.TIMESERIES ||
          panel.type === DashboardPanelType.HEATMAP ||
          panel.type === DashboardPanelType.GAUGE,
      })}
      ref={wrapperRef}
    >
      <ErrorBoundary
        errorMessage={
          <DashboardPanelNoData
            baseWidth={baseWidth}
            gridPos={panel.gridPos}
            message="Failed to load panel"
          />
        }
      >
        <DashboardPanelHeader
          baseHeight={baseHeight}
          baseWidth={baseWidth}
          onClickHeader={() => updateSelectedPanel(panelIndex, nestedIndex)}
          dashboardState={dashboardState}
          dashboardTemplateState={dashboardTemplateState}
          disableEditPanel={disableEditPanel}
          onDelete={() => dashboardState.deletePanel(panelIndex)}
          onEdit={null}
          panel={panel}
        />

        {panel.type === DashboardPanelType.PLACEHOLDER && (
          <DashboardPanelPlaceholder dashboardState={dashboardState} />
        )}
        {panel.type === DashboardPanelType.TEXT && (
          <DashboardPanelFreeText {...prop} />
        )}
        {panel.type === DashboardPanelType.STAT && (
          <DashboardPanelStat {...prop} />
        )}
        {panel.type === DashboardPanelType.TABLE && (
          <DashboardPanelTable {...prop} />
        )}
        {panel.type === DashboardPanelType.GRAFANA_POLYSTAT_PANEL && (
          <DashboardPanelPolyStat {...prop} />
        )}
        {(panel.type === DashboardPanelType.TIMESERIES ||
          panel.type === DashboardPanelType.HEATMAP ||
          panel.type === DashboardPanelType.GAUGE) && (
          <DashboardPanelChart {...prop} />
        )}
        {panel.type === DashboardPanelType.TREEMAP && (
          <DashboardPanelChartInstant {...prop} />
        )}
        {panel.type === DashboardPanelType.GROUP && (
          <DashboardPanelGroup {...prop} />
        )}
        {SUPPORTED_PANELS.indexOf(panel.type) === -1 && (
          <div className="dashboard-panel__body"></div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default DashboardPanelWrapper;
