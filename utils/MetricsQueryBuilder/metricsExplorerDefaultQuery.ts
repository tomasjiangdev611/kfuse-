import { ChartProps, ExplorerQueryProps } from 'types/MetricsQueryBuilder';
import { getFunctionParams } from '.';

export const getMetricsExplorerDefaultChart = (
  metricName: string,
  chartIndex: number,
): ChartProps => {
  const query = getMetricsExplorerDefaultQuery(metricName);

  return {
    chartId: `chart_${chartIndex + 1}`,
    formulas: [],
    isLoading: false,
    queries: [query],
    title: `Chart ${chartIndex + 1}`,
    isTitleEditing: false,
  };
};

export const getMetricsExplorerDefaultQuery = (
  metricName: string,
): ExplorerQueryProps => {
  const defaultFunction = getFunctionParams('avg_by');
  return {
    isActive: true,
    functions: [
      {
        name: 'avg_by',
        params: defaultFunction,
        vectorType: 'instant',
      },
    ],
    labels: [],
    metric: metricName,
    queryKey: 'a',
    series: [],
    showInput: false,
    steps: null,
  };
};
