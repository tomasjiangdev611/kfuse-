import uPlot, { Series } from 'uplot';

import { formatYAxis } from './axis-formatting';
import { StrokeType, UplotChartStyles } from '../types';

/**
 * Convert hex color to rgba
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const addGradientToSeries = (
  series: Series,
): { fill: string; stroke: string } => {
  const { stroke } = series;
  const fill = hexToRgba(stroke as string, 0.1);
  const strokeNew = hexToRgba(stroke as string, 1);

  return { fill, stroke: strokeNew };
};

export const getLineSeries = (
  series: Series[],
  fillOpacity: number,
  pointSize: UplotChartStyles['pointSize'],
  showPoints: UplotChartStyles['showPoints'],
  lineWidth: UplotChartStyles['lineWidth'],
): Series[] => {
  const newSeries: Series[] = [];
  series.forEach((s, i) => {
    const newS = { ...s };
    if (fillOpacity) {
      const { fill, stroke } = addGradientToSeries(s);
      newS.fill = fill;
      newS.stroke = stroke;
    }

    if (showPoints === 'always') {
      newS.points = { show: true, size: pointSize, fill: newS.stroke };
    }

    if (lineWidth !== undefined && lineWidth !== null) {
      newS.width = lineWidth;
    }
    newSeries.push(newS);
  });

  return newSeries;
};

export const getUplotChartBar = (
  chartWidth: number,
  data: Array<number[]>,
): Series.PathBuilder => {
  const { bars } = uPlot.paths;
  const barWidth = Math.min(chartWidth / data[0]?.length, 60);
  const barMinWidth = Math.max(6, barWidth - barWidth * 0.2);
  return bars({ size: [0.6, 100, barMinWidth] });
};

export const getBarSeries = (
  chartWidth: number,
  data: Array<number[]>,
  series: Series[],
): Series[] => {
  const bars60_100 = getUplotChartBar(chartWidth, data);
  const newSeries: Series[] = [];
  series.forEach((s, i) => {
    newSeries.push({
      paths: bars60_100,
      points: { show: false },
      fill: s.stroke,
      label: s.label,
      show: s.show,
    });
  });

  return newSeries;
};

export const getAreaSeries = (series: Series[]): Series[] => {
  const newSeries: Series[] = [];
  series.forEach((s, i) => {
    newSeries.push({
      fill: s.stroke,
      label: s.label,
      show: s.show,
      points: { show: false },
    });
  });

  return newSeries;
};

export const getChartYAxisWidth = (
  maxValue: number,
  unit: string,
  scaleDistribution?: UplotChartStyles['scaleDistribution'],
): number => {
  if (!maxValue) return 60;
  if (maxValue < 10 && maxValue > 1) return 50;

  const yaxisFormat = formatYAxis([maxValue], unit);
  const yaxisFormatLength = yaxisFormat[0].length;
  const yaxisFormatWidth = yaxisFormatLength * 8 + 18;

  if (scaleDistribution?.type === 'log') {
    return Math.max(35, yaxisFormatWidth + 16);
  }

  return Math.max(35, yaxisFormatWidth);
};

export const getStrokeLineConfig = (strokeType: StrokeType) => {
  switch (strokeType) {
    case 'none':
      return { lineWidth: 0, pointSize: 5, showPoints: 'always' };
    case 'thick':
      return { lineWidth: 2.5 };
    case 'thin':
      return { lineWidth: 0.5 };
    default:
      return {};
  }
};
