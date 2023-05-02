import { ReactElement } from 'react';
import { Layout } from 'react-grid-layout';

import { useDashboardState, useDashboardTemplateState } from './hooks';

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
  expression?: string;
  expr: string;
  hide?: boolean;
  interval: string;
  intervalFactor?: number;
  legendFormat?: string;
  query?: string;
  refId: string;
  step?: number;
  type: 'query' | 'formula';
};

export type DashboardPanelProps = {
  collapsed?: boolean;
  datasource?: { type: 'loki' | 'prometheus'; uid: string };
  description?: string;
  fieldConfig?: {
    defaults: DashboardFieldConfigProps;
    overrides?: DashboardPanelOverrideProps[];
  };
  gridPos: Layout;
  id?: number;
  links?: { targetBlank: boolean; title: string; url: string }[];
  options?: {
    colorMode?: string;
    content?: string;
    legend?: { calcs: string[]; displayMode: string; placement: string };
    mode?: 'markdown' | 'html';
    textMode?: string;
    tooltip?: { mode: string; sort: 'desc' | 'asc' };
  };
  panels?: DashboardPanelProps[];
  targets?: DashboardPanelTargetsProps[];
  title: string;
  transformations?: DashboardPanelTableTransformProps[];
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
  includeAll: boolean;
  label: string;
  multi: boolean;
  name: string;
  options: { selected: boolean; text: string; value: string }[];
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
    scaleDistribution?: { log: number; type: 'linear' | 'log' };
    showPoints?: 'auto' | 'always' | 'never';
    stacking?: { group: string; mode: string };
  };
  decimals?: number;
  mappings?: DashboardPanelConfigMappingProps[];
  thresholds?: DashboardPanelConfigThresholdProps;
  unit?: string;
};

export type DashboardReloadPanelsProps = {
  [key: string]: boolean | DashboardReloadPanelsProps;
};

export type DashboardPanelComponentProps = {
  baseHeight?: number;
  baseWidth?: number;
  dashboardState: ReturnType<typeof useDashboardState>;
  dashboardTemplateState: ReturnType<typeof useDashboardTemplateState>;
  disableEditPanel?: boolean;
  isInView?: boolean;
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
  colorMode?: string;
  name?: string;
  prefix?: string;
  suffix?: string;
  text: string;
  textMode?: string;
};

export type DashboardPanelTableTransformProps = {
  id: string;
  options: any;
};

export type DashboardPanelOverrideProps = {
  matcher: { id: string; options: any };
  properties: Array<{ id: string; value: any }>;
};

export type DashboardTemplateValueProps = {
  [key: string]: string | string[];
};
