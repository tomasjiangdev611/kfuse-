import {
  DashboardFieldConfigProps,
  DashboardPanelProps,
  DashboardPanelTargetsProps,
} from '../types';

export const prepTimeseriesTargetData = (
  promqlFormulas: string[],
  promqlQueries: string[],
  queryKeys: string[],
): DashboardPanelTargetsProps[] => {
  const targets: DashboardPanelTargetsProps[] = [];

  promqlQueries.forEach((promql: string, index: number) => {
    targets.push({
      expr: promql,
      interval: '1m',
      refId: queryKeys[index],
      type: 'query',
    });
  });

  promqlFormulas.map((formula: string, index: number) => {
    targets.push({
      expr: formula,
      interval: '1m',
      refId: `formula${index}`,
      type: 'query',
    });
  });

  return targets;
};

export const prepQueryValueTargetData = (
  promqlFormulas: string[],
  promqlQueries: string[],
  activeIndex: number,
): DashboardPanelTargetsProps[] => {
  const targets: DashboardPanelTargetsProps[] = [];

  if (promqlFormulas.length > 0) {
    targets.push({
      expr: promqlFormulas[0],
      interval: '1m',
      refId: 'a',
      type: 'query',
    });
  } else {
    targets.push({
      expr: promqlQueries[activeIndex],
      interval: '1m',
      refId: 'a',
      type: 'query',
    });
  }

  return targets;
};

/**
 * Get largest y-axis value from the panel gridPos
 * @param panels
 */
export const getLargestYAxisValue = (panels: DashboardPanelProps[]): number => {
  const yAxisValues = panels.map((panel) => panel.gridPos.y);
  return Math.max(...yAxisValues);
};

/**
 * Get active promql query from the panel targets
 * @param targets
 */
export const getActivePromqlQuery = (
  targets: DashboardPanelTargetsProps[],
): DashboardPanelTargetsProps[] => {
  const filteredTargets = targets && targets.filter((target) => !target.hide);
  return filteredTargets || [];
};

/**
 * Get active promql query from the panel targets
 * @param targets
 */
export const getActivePromqlQueryRefId = (
  targets: DashboardPanelTargetsProps[],
): string[] => {
  const activePromqlQueries = getActivePromqlQuery(targets);
  return activePromqlQueries.map((query) => query.refId);
};

export const mapTimeseriesDrawStyle = (
  custom: DashboardFieldConfigProps['custom'],
): string[] => {
  const { drawStyle, stacking } = custom;

  if (stacking && stacking.mode === 'normal' && drawStyle === 'bars') {
    return ['Stacked Bar'];
  }

  switch (drawStyle) {
    case 'lines':
      return ['Line'];
    case 'bars':
      return ['Bar'];
    case 'area':
      return ['Area'];
    default:
      return ['Line'];
  }
};

export const mapTimeseriesLegendMode = (displayMode: string): string => {
  switch (displayMode) {
    case 'list':
      return 'compact';
    default:
      return 'none';
  }
};

export const mapTimeseriesTooltipMode = (displayMode: string): string => {
  switch (displayMode) {
    case 'multi':
      return 'multi';
    default:
      return 'compact';
  }
};
