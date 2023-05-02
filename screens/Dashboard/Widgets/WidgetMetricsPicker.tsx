import {
  MetricsQueryBuilder,
  Stepper,
  useToastmasterContext,
} from 'components';
import { useMetricsQueryState } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { ExplorerQueryProps } from 'types';
import { parsePromqlAndBuildQuery } from 'utils/PromqlParser';

import {
  DashboardPanelModalFooter,
  DashboardPanelModalHeader,
} from '../components';
import {
  HeatmapGraph,
  PieChartGraph,
  QueryValue,
  Timeseries,
  Treemap,
} from './Graph';
import {
  useDashboardState,
  useDashboardModalState,
  useDashboardTemplateState,
} from '../hooks';
import { DashboardPanelProps, DashboardPanelType } from '../types';
import {
  getActivePromqlQuery,
  getPromqlForQueryAndFormula,
  prepQueryValueTargetData,
  prepTimeseriesTargetData,
  transformPromql,
} from '../utils';
import VisualizationTypesList from './VisualizationTypesList';
import WidgetTitle from './WidgetTitle';

const MetricsPicker = ({
  baseWidth,
  close,
  dashboardState,
  dashboardModalState,
  dashboardTemplateState,
  nestedIndex,
  panel,
  panelType,
}: {
  baseWidth: number;
  close: () => void;
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardModalState: ReturnType<typeof useDashboardModalState>;
  dashboardTemplateState: ReturnType<typeof useDashboardTemplateState>;
  nestedIndex?: string;
  panel?: DashboardPanelProps;
  panelType: DashboardPanelType;
}): ReactElement => {
  const { addToast } = useToastmasterContext();
  const { modalDate, panelData, setModalDate, updatePanelAnnotation } =
    dashboardModalState;
  const metricsQueryState = useMetricsQueryState(modalDate);
  const { charts, chartData, replaceCharts } = metricsQueryState;
  const { date, addPanel } = dashboardState;
  const { templating } = dashboardTemplateState;

  const onSaveClick = () => {
    const { formulas, queries } = charts[0];
    const { promqlFormulas, promqlQueries } = getPromqlForQueryAndFormula(
      queries,
      formulas,
    );

    const queryKeys = queries.map(
      (query: ExplorerQueryProps) => query.queryKey,
    );

    if (panelData.type === 'timeseries' || panelData.type === 'heatmap') {
      panelData.targets = prepTimeseriesTargetData(
        promqlQueries,
        promqlFormulas,
        queryKeys,
      );
    }

    if (
      panelData.type === 'stat' ||
      panelData.type === 'piechart' ||
      panelData.type === 'treemap'
    ) {
      const activeIndex = queries.findIndex(
        (query: ExplorerQueryProps) => query.isActive,
      );
      if (activeIndex === -1) {
        addToast({
          text: 'Failed to save make sure you have active metric',
          status: 'error',
        });
      }
      panelData.targets = prepQueryValueTargetData(
        promqlFormulas,
        promqlQueries,
        activeIndex,
      );
    }

    addPanel(panelData, nestedIndex);
    close();
  };

  const setEditPanelData = () => {
    const promqlQueries = getActivePromqlQuery(panel.targets).map((target) =>
      transformPromql({
        date,
        promql: target.expr,
        templating,
        width: baseWidth,
      }),
    );

    const parsedQuery = parsePromqlAndBuildQuery(promqlQueries);
    replaceCharts(parsedQuery);
  };

  useEffect(() => {
    if (panel) {
      updatePanelAnnotation('title', panel.title);
      setEditPanelData();
    } else {
      updatePanelAnnotation('title', `${panelType} chart`);
    }
    updatePanelAnnotation('type', panelType);
  }, []);

  return (
    <div className="dashboard__widget__metrics-picker">
      <DashboardPanelModalHeader
        close={close}
        modalDate={modalDate}
        setModalDate={setModalDate}
      />
      <div className="dashboard__panel-modal__scrollview dashboard__panel-modal__body">
        <div className="dashboard__widget__metrics-picker__chart">
          {panelData.type === DashboardPanelType.TIMESERIES && (
            <Timeseries chartData={chartData.chart_1} />
          )}
          {panelData.type === DashboardPanelType.STAT && (
            <QueryValue metricsQueryState={metricsQueryState} />
          )}
          {panelData.type === DashboardPanelType.PIECHART && (
            <PieChartGraph metricsQueryState={metricsQueryState} />
          )}
          {panelData.type === DashboardPanelType.TREEMAP && (
            <Treemap metricsQueryState={metricsQueryState} />
          )}
          {panelData.type === DashboardPanelType.HEATMAP && (
            <HeatmapGraph metricsQueryState={metricsQueryState} />
          )}
        </div>
        <Stepper
          steps={[
            {
              title: 'Choose Visualization',
              component: (
                <VisualizationTypesList
                  widgetType={panelType}
                  onChange={(type) => {
                    updatePanelAnnotation('type', type);
                  }}
                />
              ),
            },
            {
              title: 'Choose Metrics',
              component: (
                <div className="dashboard__widget__metrics-query-builder">
                  <MetricsQueryBuilder metricsQueryState={metricsQueryState} />
                </div>
              ),
            },
            {
              title: 'Enter chart title',
              component: (
                <WidgetTitle dashboardModalState={dashboardModalState} />
              ),
            },
          ]}
        />
      </div>
      <DashboardPanelModalFooter close={close} onSave={onSaveClick} />
    </div>
  );
};

export default MetricsPicker;
