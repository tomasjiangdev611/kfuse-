import { ReactElement } from 'react';
import { Layout } from 'react-grid-layout';

import { useDashboardState } from '../screens/Dashboard/hooks';

export enum DashboardPanelType {
  EMBED = 'embed',
  GAUGE = 'gauge',
  GRAFANA_POLYSTAT_PANEL = 'grafana-polystat-panel',
  LEGACY_GRAPH = 'graph',
  GROUP = 'group',
  IMAGE = 'image',
  HEATMAP = 'heatmap',
  PLACEHOLDER = 'placeholder',
  ROW = 'row',
  TABLE = 'table',
  TEXT = 'text',
  TREEMAP = 'treemap',
  TIMESERIES = 'timeseries',
  PIECHART = 'piechart',
  STAT = 'stat',
}

export const SUPPORTED_PANELS = Object.values(DashboardPanelType);

export type WidgetItemProps = {
  icon?: ReactElement;
  label: string;
  name: DashboardPanelType;
};

export type WidgetProps = {
  label: string;
  list: WidgetItemProps[];
  name: string;
};

export type DashboardPanelTargetsProps = {
  expr: string;
  hide?: boolean;
  interval: string;
  refId: string;
  type: 'query' | 'formula';
};

export type DashboardPanelProps = {
  collapsed?: boolean;
  fieldConfig?: { defaults: DashboardFieldConfigProps };
  gridPos: Layout;
  id?: number;
  options?: {
    legend?: {
      calcs: string[];
      displayMode: string;
      placement: string;
    };
    tooltip?: { mode: string; sort: 'desc' | 'asc' };
    content?: string;
    mode?: 'markdown' | 'html';
  };
  panels?: DashboardPanelProps[];
  targets?: DashboardPanelTargetsProps[];
  title: string;
  type: DashboardPanelType;
};

export type DashboardProps = {
  description: string;
  id?: string;
  templating?: { list: DashboardTemplateProps[] };
  time?: {
    from: string;
    to: string;
  };
  title: string;
  uid?: string;
};

export type DashboardTemplateProps = {
  allValue: string;
  current: { selected: boolean; text: string | string[]; value: string };
  definition: string;
  label: string;
  name: string;
  query: { query: string; refId: string };
  type: string;
};

export type DashboardFieldConfigProps = {
  color?: { mode: string };
  custom?: {
    barAlignment?: number;
    drawStyle?: string;
    fillOpacity?: number;
    gradientMode?: 'none' | 'opacity' | 'hue';
    lineInterpolation?: 'linear' | 'smooth';
    lineWidth?: number;
    pointSize?: number;
  };
  mappings?: DashboardPanelConfigMappingProps[];
  thresholds?: DashboardPanelConfigThresholdProps;
  unit?: string;
};

export type DashboardReloadPanelsProps = {
  [key: string]: boolean | DashboardReloadPanelsProps;
};

export type DashboardPanelComponentProps = {
  dashboardState: ReturnType<typeof useDashboardState>;
  disableEditPanel?: boolean;
  nestedIndex?: string;
  panel: DashboardPanelProps;
  panelIndex: number;
};

export type DashboardPanelConfigMappingProps = {
  options: {
    from: number;
    to: number;
    match: string;
    result: DashboardPanelConfigMappingOptionsProps;
    [key: string]: DashboardPanelConfigMappingOptionsProps;
  };
  type: 'value' | 'range' | 'special';
};

export type DashboardPanelConfigThresholdProps = {
  mode: 'absolute' | 'percentage' | 'palette-classic';
  steps: Array<{ color: string; value: number }>;
};

export type DashboardPanelConfigMappingOptionsProps = {
  color: string;
  index: number;
  text: string;
};

export type DashboardPanelStatTextProps = {
  color?: string;
  prefix?: string;
  suffix?: string;
  text: string;
};
