import { HexagonMap, Loader } from 'components';
import React, { ReactElement, useEffect, useState } from 'react';
import ResizeObserver from 'rc-resize-observer';

import { useDashboardDataLoader } from '../hooks';
import { DashboardPanelComponentProps } from '../types';
import { getPolyStatData } from '../utils';

const DashboardPanelPolyStat = ({
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  isInView,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const [chartSize, setChartSize] = useState({ width: 400, height: 300 });
  const [polyData, setPolyData] = useState<any>([]);
  const { templateValues } = dashboardTemplateState;

  const dashboardDataLoader = useDashboardDataLoader({
    baseWidth,
    dashboardState,
    isInView,
    nestedIndex,
    panelIndex,
    templateValues,
    type: 'stat',
  });

  useEffect(() => {
    if (dashboardDataLoader.result) {
      const polyStatData = getPolyStatData(dashboardDataLoader.result, panel);
      setPolyData(polyStatData);
    }
  }, [dashboardDataLoader.result]);

  return (
    <ResizeObserver
      onResize={(size) => {
        setChartSize({
          width: size.width - 8,
          height: Math.max(size.height - 28, 80),
        });
      }}
    >
      <Loader isLoading={dashboardDataLoader.isLoading}>
        {dashboardDataLoader.result ? (
          <HexagonMap
            data={polyData}
            height={chartSize.height}
            width={chartSize.width}
          />
        ) : (
          <div />
        )}
      </Loader>
    </ResizeObserver>
  );
};

export default DashboardPanelPolyStat;
