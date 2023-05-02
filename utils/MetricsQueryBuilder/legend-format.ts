import { getSeriesColor } from 'requests';
import { Series } from 'uplot';

export const formatChartLegend = (
  idx: number,
  metric: { [key: string]: any },
  format: string,
): Series => {
  const isSeriesOutlier = metric['outlier'];
  const outlierSeriesWidth = isSeriesOutlier === 'true' ? 2.5 : 0.5;
  const label = replaceLegendVariables(format, metric);

  return {
    label,
    points: { show: false },
    stroke: getSeriesColor(metric, idx),
    show: true,
    width: isSeriesOutlier ? outlierSeriesWidth : 1,
  };
};

/**
 * Replaces legend variables with their values
 * @param legendFormat
 * @param metric
 * variable format: {{variable_name}} or {{ variable_name }}
 */
export const replaceLegendVariables = (
  legendFormat: string,
  metric: { [key: string]: any },
): string => {
  const variables = legendFormat.match(/{{\s*[\w.]+\s*}}/g);

  if (!variables) {
    return legendFormat;
  }

  variables.forEach((variable) => {
    const variableName = variable.replace(/{{\s*|\s*}}/g, '');
    const variableValue = metric[variableName];
    if (variableValue) {
      legendFormat = legendFormat.replace(variable, variableValue);
    }
  });

  return legendFormat;
};
