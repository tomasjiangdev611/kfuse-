import classNames from 'classnames';
import { SunburstGraph, TreemapGraph } from 'components/Chart';
import React, { ReactElement, useState } from 'react';
import ResizeObserver from 'rc-resize-observer';

import { useDashboardDataLoader } from '../hooks';
import { DashboardPanelComponentProps } from '../types';

const DashboardPanelChartInstant = ({
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  isInView,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const [chartSize, setChartSize] = useState({ width: 400, height: 200 });
  const { templateValues } = dashboardTemplateState;

  const dashboardDataLoader = useDashboardDataLoader({
    baseWidth,
    dashboardState,
    isInView,
    nestedIndex,
    panelIndex,
    templateValues,
    type: 'piechart',
  });

  return (
    <ResizeObserver
      onResize={(size) => {
        setChartSize({
          width: size.width - 8,
          height: Math.max(size.height - 16, 200),
        });
      }}
    >
      <div
        className={classNames({
          'dashboard-panel__body__piechart': panel.type === 'piechart',
          'dashboard-panel__body__treemap': panel.type === 'treemap',
        })}
      >
        {dashboardDataLoader.result && panel.type === 'piechart' && (
          <SunburstGraph
            data={dashboardDataLoader.result.data || []}
            height={chartSize.height - 20}
            width={chartSize.width}
          />
        )}
        {dashboardDataLoader.result && panel.type === 'treemap' && (
          <TreemapGraph
            data={dashboardDataLoader.result.data || []}
            height={chartSize.height - 20}
            width={chartSize.width}
          />
        )}
      </div>
    </ResizeObserver>
  );
};

export default DashboardPanelChartInstant;
