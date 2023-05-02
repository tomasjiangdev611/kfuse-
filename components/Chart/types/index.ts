import { ReactElement } from 'react';
import { DateSelection } from 'types/DateSelection';
import { Axis, Band, Cursor, Series, Legend, Scale } from 'uplot';

export type UPlotConfig = {
  width: number;
  height: number;
  axes: Axis[];
  cursor: Cursor;
  series: Series[];
  scales?: Scale;
  legend: Legend;
  hooks: { [key: string]: Array<any> };
  addHook?: (type: string, hook: any) => void;
};

export type ToolbarMenuItem = {
  label: string;
  onClick: () => void;
};

export type ChartType = 'Line' | 'Bar' | 'Stacked Bar' | 'Area';
export type StrokeType = 'normal' | 'thick' | 'thin' | 'none';

export enum LegendTypes {
  AGGREGATE = 'aggregate',
  COMPACT = 'compact',
  VALUES = 'values',
  SIMPLE = 'simple',
  NONE = 'none',
}
export type TooltipTypes = 'compact' | 'default' | 'multi' | 'single';

export type UplotChartStyles = {
  fillOpacity?: number;
  gradientMode?: 'none' | 'opacity' | 'hue';
  lineInterpolation?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  lineWidth?: number;
  pointSize?: number;
  showPoints?: 'auto' | 'always' | 'never';
  scaleDistribution?: { type: 'linear' | 'log'; log?: number };
};

export type ChartRenderDataProps = {
  data: Array<number[]>;
  series: Series[];
  maxValue?: number;
  minValue?: number;
};

export type ChartToolbarProps = {
  leftToolbar?: ReactElement;
  rightToolbar?: ReactElement;
  toolbarMenuItems?: ToolbarMenuItem[];
  toolbarMenuType?: 'dropdown' | 'button';
};

export type ChartRenderProps = {
  bands?: Band[];
  chartTypes: ChartType[];
  date?: DateSelection;
  chartData: ChartRenderDataProps;
  hooks?: [{ type: string; hook: (u: uPlot, si: number) => void }];
  isLoading: boolean;
  layoutType?: 'dashboard' | 'explore';
  legend?: { legendType?: LegendTypes; legendHeight?: number };
  onSeriesShowHide?: (series: Series[]) => void;
  size: { width: number; height?: number };
  styles?: { chartStyles?: UplotChartStyles; boxShadow?: boolean };
  strokeType?: StrokeType;
  toolbar?: ChartToolbarProps;
  tooltipType?: TooltipTypes;
  unit: string;
};

export type ChartToolbarPropsComponent = {
  activeChart: ChartType;
  chartTypes: ChartType[];
  setActiveChart: (chartType: ChartType) => void;
  setActiveStroke: (strokeType: StrokeType) => void;
  activeStroke: StrokeType;
  toolbar?: ChartToolbarProps;
};

export type ChartConfigProps = {
  bands?: Band[];
  chartStyles?: UplotChartStyles;
  darkModeEnabled: boolean;
  data: Array<number[]>;
  hooks?: [{ type: string; hook: (u: uPlot, si: number) => void }];
  maxValue?: number;
  series: Series[];
  size: ChartRenderProps['size'];
  type: ChartType;
  unit: string;
};

export type TooltipCoordsProps = {
  x: number;
  y: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
};
