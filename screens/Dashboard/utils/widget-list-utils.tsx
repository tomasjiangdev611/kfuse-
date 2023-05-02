import React from 'react';
import { AiOutlineLineChart } from 'react-icons/ai';
import { BsFillFileTextFill, BsPieChartFill, BsTable } from 'react-icons/bs';
import { RiLayoutMasonryFill, RiLayout4Line } from 'react-icons/ri';
import { TbMist } from 'react-icons/tb';
import { TiSortNumerically } from 'react-icons/ti';

import { DashboardPanelType, WidgetProps, WidgetItemProps } from '../types';

export const SUPPORTED_PANELS = [
  DashboardPanelType.TIMESERIES,
  DashboardPanelType.STAT,
  DashboardPanelType.TABLE,
  DashboardPanelType.HEATMAP,
  DashboardPanelType.PIECHART,
  DashboardPanelType.TREEMAP,
  DashboardPanelType.TEXT,
  DashboardPanelType.GROUP,
  DashboardPanelType.PLACEHOLDER,
  DashboardPanelType.GRAFANA_POLYSTAT_PANEL,
];

export const GRAPH_PANELS = [
  DashboardPanelType.TIMESERIES,
  DashboardPanelType.STAT,
  DashboardPanelType.TABLE,
  DashboardPanelType.HEATMAP,
  DashboardPanelType.PIECHART,
  DashboardPanelType.TREEMAP,
];

export const GraphWidgetList: WidgetItemProps[] = [
  {
    name: DashboardPanelType.TIMESERIES,
    label: 'Timeseries',
    icon: <AiOutlineLineChart />,
  },
  { name: DashboardPanelType.STAT, label: 'Stat', icon: <TiSortNumerically /> },
  { name: DashboardPanelType.TABLE, label: 'Table', icon: <BsTable /> },
  { name: DashboardPanelType.HEATMAP, label: 'Heatmap', icon: <TbMist /> },
  {
    name: DashboardPanelType.PIECHART,
    label: 'Pie Chart',
    icon: <BsPieChartFill />,
  },
  {
    name: DashboardPanelType.TREEMAP,
    label: 'Treemap',
    icon: <RiLayout4Line />,
  },
];

const TextAndEmbedWidgetList: WidgetItemProps[] = [
  {
    name: DashboardPanelType.TEXT,
    label: 'Text',
    icon: <BsFillFileTextFill />,
  },
  {
    name: DashboardPanelType.GROUP,
    label: 'Group',
    icon: <RiLayoutMasonryFill />,
  },
];

export const widgetList: WidgetProps[] = [
  {
    name: 'Graph',
    label: 'Graph',
    list: GraphWidgetList,
  },
  {
    name: 'TextAndEmbed',
    label: 'Text & Embed',
    list: TextAndEmbedWidgetList,
  },
];

export default widgetList;
