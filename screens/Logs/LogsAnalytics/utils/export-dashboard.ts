import { DashboardPanelProps, DashboardPanelType } from 'types/Dashboard';

const annotations = {
  list: [
    {
      builtIn: 1,
      datasource: { type: 'grafana', uid: '-- Grafana --' },
      enable: true,
      hide: true,
      iconColor: 'rgba(0, 211, 255, 1)',
      name: 'Annotations & Alerts',
      target: { limit: 100, matchAny: false, tags: [], type: 'dashboard' },
      type: 'dashboard',
    },
  ],
};

export const timeseriesFieldConfig = {
  defaults: {
    color: { mode: 'palette-classic' },
    custom: {
      axisLabel: '',
      axisPlacement: 'auto',
      barAlignment: 0,
      drawStyle: 'line',
      fillOpacity: 0,
      gradientMode: 'none',
      hideFrom: { legend: false, tooltip: false, viz: false },
      lineInterpolation: 'linear',
      lineWidth: 1,
      pointSize: 5,
      scaleDistribution: { type: 'linear' },
      showPoints: 'auto',
      spanNulls: false,
      stacking: { group: 'A', mode: 'none' },
      thresholdsStyle: { mode: 'off' },
    },
    mappings: [],
    thresholds: { mode: 'absolute', steps: [{ color: 'green', value: null }] },
  },
  overrides: [],
};

export const getExportDashboardPanel = ({
  datasourceUid,
  expr,
  gridPos,
  panelId,
  title,
}: {
  datasourceUid: string;
  expr: string;
  gridPos?: DashboardPanelProps['gridPos'];
  panelId?: number;
  title: string;
}): DashboardPanelProps => {
  return {
    datasource: { type: 'loki', uid: datasourceUid },
    gridPos: gridPos || { x: 0, y: 0, w: 12, h: 8, i: '0' },
    id: panelId || 1,
    options: {
      legend: { calcs: [], displayMode: 'list', placement: 'bottom' },
      tooltip: { mode: 'single', sort: 'none' },
    },
    targets: [
      {
        datasource: { type: 'loki', uid: datasourceUid },
        editorMode: 'code',
        expr: expr,
        key: 'Q-09b106c9-2f31-4591-b382-480e5236903f-0',
        queryType: 'range',
        refId: 'A',
      },
    ],
    title: title,
    type: DashboardPanelType.TIMESERIES,
  };
};

export const getNewDashboardJSONModel = ({
  dashboardDetails,
  datasourceUid,
  expr,
  timeDiff,
}: {
  dashboardDetails: { title: string; panelName: string };
  datasourceUid: string;
  expr: string;
  timeDiff: { from: string; to: string };
}) => {
  return {
    annotations: annotations,
    editable: true,
    fieldConfig: timeseriesFieldConfig,
    fiscalYearStartMonth: 0,
    graphTooltip: 0,
    links: [],
    liveNow: false,
    panels: [
      getExportDashboardPanel({
        datasourceUid,
        expr,
        title: dashboardDetails.panelName,
      }),
    ],
    schemaVersion: 36,
    style: 'dark',
    tags: [],
    templating: { list: [] },
    time: timeDiff,
    timepicker: {},
    timezone: '',
    title: dashboardDetails.title,
    version: 0,
    weekStart: '',
    id: null,
    uid: '',
    hideControls: false,
  };
};

export const findLargestBottomOfDashboard = (
  panels: DashboardPanelProps[],
): DashboardPanelProps['gridPos'] => {
  // find the largest y of gridPos
  let largestBottom = 0;
  panels.forEach((panel) => {
    const bottom = panel.gridPos.y + panel.gridPos.h;
    if (bottom > largestBottom) {
      largestBottom = bottom;
    }
  });

  return { x: 0, y: largestBottom, w: 12, h: 8, i: '0' };
};
