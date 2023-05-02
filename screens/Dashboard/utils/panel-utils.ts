import { ChartRenderProps } from 'components';
import {
  GRID_CELL_HEIGHT,
  GRID_COLUMN_COUNT,
  GRID_HEADER_HEIGHT,
} from '../constants';
import {
  DashboardFieldConfigProps,
  DashboardPanelProps,
  DashboardPanelType,
} from '../types';

/**
 * Convert legacy panel type graph to timeseries
 * @param panel
 * @returns panel
 */
const convertLegacyGraphToTimeseries = (
  panel: DashboardPanelProps,
): DashboardPanelProps => {
  const newPanel: DashboardPanelProps = {};
  newPanel.type = DashboardPanelType.TIMESERIES;
  newPanel.gridPos = panel.gridPos;
  newPanel.id = panel.id;
  newPanel.title = panel.title;
  newPanel.targets = panel.targets.map((target) => {
    return { ...target, hide: target.exemplar || false };
  });
  newPanel.options = {
    legend: { calcs: ['last'], displayMode: 'list', placement: 'bottom' },
    tooltip: { mode: 'single', sort: 'desc' },
  };
  newPanel.fieldConfig = {
    defaults: {
      custom: {
        drawStyle: 'Line',
        barAlignment: 0,
        fillOpacity: 10,
        lineInterpolation: 'linear',
      },
    },
  };
  return newPanel;
};

const gridDepth = (panels: DashboardPanelProps[]): number => {
  const depthMap = new Map<number, number>();

  // Iterate through the rectangles and sum the heights with the same x value
  for (const panel of panels) {
    const currentDepth = depthMap.get(panel.gridPos.x) || 0;
    depthMap.set(panel.gridPos.x, currentDepth + panel.gridPos.h);
  }

  // Find the maximum depth among all x values
  let maxDepth = 0;
  for (const depth of depthMap.values()) {
    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;
};

/**
 * Transform panel
 */
export const transformPanels = (
  panels: DashboardPanelProps[],
): DashboardPanelProps[] => {
  const newPanels: DashboardPanelProps[] = [];
  panels.forEach((panel, idx) => {
    if (!panel.gridPos) {
      panels[idx].gridPos = { h: 4, w: 3, x: 0, y: 0, i: `${idx}` };
    }

    if (panel.type === DashboardPanelType.LEGACY_GRAPH) {
      newPanels.push(convertLegacyGraphToTimeseries(panel));
    } else {
      newPanels.push(panel);
    }

    if (panel.type === DashboardPanelType.ROW && panel.panels) {
      const groupPanels = transformPanels(panel.panels);
      const totalVerticalHeight = gridDepth(groupPanels);

      newPanels.push({
        type: DashboardPanelType.GROUP,
        gridPos: {
          x: 0,
          y: panel.gridPos.y + 1,
          w: 24,
          h: totalVerticalHeight + 0.5,
          i: `${idx}`,
        },
        panels: groupPanels,
        title: null,
      });
    }
  });

  return newPanels;
};

export const getPanelWidthHeight = (
  gridPos: DashboardPanelProps['gridPos'],
  baseWidth: number,
  title?: string,
): { width: number; height: number; heightContainer: number } => {
  const OFFSET = 32;
  const gridWidth = (baseWidth - OFFSET) / GRID_COLUMN_COUNT;
  let gridHeight = GRID_CELL_HEIGHT * gridPos.h || 1;

  if (!title) {
    gridHeight = gridHeight + GRID_HEADER_HEIGHT - 8;
  }

  return {
    width: gridWidth * gridPos.w || 1,
    height: gridHeight,
    heightContainer: gridHeight - GRID_HEADER_HEIGHT + 8,
  };
};

/**
 * Get panel styles
 * @param panelConfig
 */
export const getPanelStyles = (
  panelConfig: DashboardFieldConfigProps,
): ChartRenderProps['chartStyles'] => {
  if (!panelConfig || !panelConfig.custom) {
    return {};
  }

  const {
    pointSize,
    fillOpacity,
    gradientMode,
    lineWidth,
    lineInterpolation,
    showPoints,
    scaleDistribution,
  } = panelConfig.custom;

  const styles: ChartRenderProps['chartStyles'] = {
    pointSize: pointSize || 5,
    fillOpacity: fillOpacity || 0,
    gradientMode: gradientMode || 'none',
    lineWidth: lineWidth || 1,
    lineInterpolation: lineInterpolation || 'linear',
    showPoints: showPoints || 'auto',
    lineStyle: 'solid',
    scaleDistribution,
  };

  return styles;
};
