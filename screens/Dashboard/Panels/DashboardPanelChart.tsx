import { ChartRenderer, Heatmap, Loader } from 'components';
import React, { ReactElement, useMemo, useState } from 'react';
import ResizeObserver from 'rc-resize-observer';

import { DashboardPanelNoData } from '../components';
import { useDashboardDataLoader } from '../hooks';
import { DashboardPanelComponentProps, DashboardPanelType } from '../types';
import {
  checkIfDataNotAvailable,
  getPanelStyles,
  mapTimeseriesDrawStyle,
  mapTimeseriesLegendMode,
  mapTimeseriesTooltipMode,
  setDateRangeOnChartZoom,
} from '../utils';
import { GaugeGraph } from '../Widgets/Graph';

const PanelChart = ({
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  isInView,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const [chartSize, setChartSize] = useState({ width: 400, height: 200 });
  const { options, fieldConfig } = panel;
  const { templateValues } = dashboardTemplateState;
  const { onDateChange } = dashboardState;

  const dashboardDataLoader = useDashboardDataLoader({
    baseWidth,
    dashboardState,
    isInView,
    nestedIndex,
    panelIndex,
    templateValues,
    type: 'timeseries',
  });

  const seriesLegendsHeight = useMemo(() => {
    const labelLength = dashboardDataLoader.result?.series.reduce((acc, s) => {
      if (!s.label) {
        return acc;
      }
      return acc + s.label.length + 2;
    }, 0);

    if (!labelLength) return 0;
    const labelLengthByPixel = labelLength * 8;
    const labelLengthByLine = Math.ceil(labelLengthByPixel / chartSize.width);
    const maxLines = Math.floor((chartSize.height * 0.3) / 15);
    return Math.min(maxLines, labelLengthByLine) * 15;
  }, [dashboardDataLoader.result]);

  const panelStyles = useMemo(
    () => getPanelStyles(panel.fieldConfig?.defaults),
    [panel],
  );

  return (
    <ResizeObserver
      onResize={(size) => {
        setChartSize({
          width: size.width - 16,
          height: Math.max(size.height - 30, 80),
        });
      }}
    >
      <Loader isLoading={dashboardDataLoader.isLoading} sizes="small">
        {panel.type === DashboardPanelType.TIMESERIES &&
          dashboardDataLoader.result && (
            <>
              {!checkIfDataNotAvailable(dashboardDataLoader.result) ? (
                <ChartRenderer
                  chartTypes={mapTimeseriesDrawStyle(
                    fieldConfig?.defaults?.custom,
                  )}
                  chartData={
                    dashboardDataLoader.result || { data: [], series: [] }
                  }
                  hooks={[
                    {
                      hook: (u) => setDateRangeOnChartZoom(u, onDateChange),
                      type: 'setSelect',
                    },
                  ]}
                  isLoading={dashboardDataLoader.isLoading}
                  layoutType="dashboard"
                  legend={{
                    legendHeight: Math.max(seriesLegendsHeight - 4, 20),
                    legendType: mapTimeseriesLegendMode(
                      options.legend.displayMode,
                    ),
                  }}
                  size={{
                    width: chartSize.width,
                    height:
                      options.legend.displayMode === 'list'
                        ? chartSize.height - seriesLegendsHeight
                        : chartSize.height,
                  }}
                  styles={{ boxShadow: false, chartStyles: panelStyles }}
                  tooltipType={mapTimeseriesTooltipMode(options.tooltip.mode)}
                  unit={panel.fieldConfig.defaults.unit || 'number'}
                />
              ) : (
                <DashboardPanelNoData
                  gridPos={panel.gridPos}
                  baseWidth={baseWidth}
                />
              )}
            </>
          )}
        {panel.type === DashboardPanelType.HEATMAP && (
          <>
            {!checkIfDataNotAvailable(dashboardDataLoader.result) ? (
              <Heatmap
                chartHeight={chartSize.height}
                chartNormalizedType="number"
                chartWidth={chartSize.width}
                grafanaData={
                  dashboardDataLoader.result || { data: [], series: [] }
                }
                isLoading={dashboardDataLoader.isLoading}
              />
            ) : (
              <DashboardPanelNoData
                gridPos={panel.gridPos}
                baseWidth={baseWidth}
              />
            )}
          </>
        )}
        {panel.type === DashboardPanelType.GAUGE && (
          <GaugeGraph
            baseWidth={baseWidth}
            chartSize={chartSize}
            dashboardDataLoader={dashboardDataLoader}
            panel={panel}
          />
        )}
      </Loader>
    </ResizeObserver>
  );
};

export default PanelChart;
