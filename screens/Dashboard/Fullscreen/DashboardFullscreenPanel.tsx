import { ChartRenderer, Loader } from 'components';
import { useDateState } from 'hooks';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { DateSelection } from 'types/DateSelection';

import { DashboardPanelModalHeader } from '../components';
import { useDashboardDataLoader } from '../hooks';
import { DashboardPanelProps, DashboardTemplateProps } from '../types';
import {
  getPanelStyles,
  mapTimeseriesDrawStyle,
  mapTimeseriesLegendMode,
  mapTimeseriesTooltipMode,
} from '../utils';

const DashboardFullscreenPanel = ({
  baseHeight,
  baseWidth,
  close,
  date,
  panel,
  templating,
}: {
  baseHeight: number;
  baseWidth: number;
  close: () => void;
  date: DateSelection;
  panel: DashboardPanelProps;
  templating: DashboardTemplateProps[];
}): ReactElement => {
  const [panelData, setPanelData] = useState<DashboardPanelProps>(panel);
  const [modalDate, setModalDate] = useDateState(date);

  const dashboardDataLoader = useDashboardDataLoader({
    baseWidth,
    dashboardState: {
      date: modalDate,
      panels: [panelData],
      reloadPanels: { '0': true },
      setReloadPanels: () => {},
    },
    isInView: true,
    panelIndex: 0,
    templating,
    type: 'timeseries',
  });

  useEffect(() => {
    const newTargets = [...panel.targets];
    setPanelData({ ...panel, targets: newTargets });
  }, [modalDate]);

  const chartHeight = Math.min(400, baseHeight - 120);
  const legendHeight = chartHeight * 0.3;
  const { options, fieldConfig } = panelData;
  const panelStyles = useMemo(
    () => getPanelStyles(panel.fieldConfig?.defaults),
    [panel],
  );
  return (
    <div
      className="dashboard__fullscreen__modal"
      style={{ height: baseHeight - 120, width: baseWidth - 60 }}
    >
      <DashboardPanelModalHeader
        close={close}
        modalDate={modalDate}
        setModalDate={setModalDate}
        title={panel.title}
      />
      <Loader isLoading={dashboardDataLoader.isLoading}>
        <ChartRenderer
          chartTypes={mapTimeseriesDrawStyle(fieldConfig?.defaults?.custom)}
          chartData={dashboardDataLoader.result || { data: [], series: [] }}
          isLoading={dashboardDataLoader.isLoading}
          layoutType="explore"
          legend={{
            legendHeight: Math.max(legendHeight - 4, 20),
            legendType: mapTimeseriesLegendMode(options.legend.displayMode),
          }}
          size={{
            width: baseWidth - 80,
            height:
              options.legend.displayMode === 'list'
                ? chartHeight - legendHeight
                : chartHeight,
          }}
          styles={{ boxShadow: false, chartStyles: panelStyles }}
          tooltipType={mapTimeseriesTooltipMode(options.tooltip.mode)}
          unit={panel.fieldConfig.defaults.unit || 'number'}
        />
      </Loader>
    </div>
  );
};

export default DashboardFullscreenPanel;
