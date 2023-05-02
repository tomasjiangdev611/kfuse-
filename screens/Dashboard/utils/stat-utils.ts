import { Series } from 'uplot';
import { clamp, findUnitCategoryFormatById, toFixed } from 'utils';

import {
  DashboardPanelConfigMappingProps,
  DashboardPanelConfigThresholdProps,
  DashboardPanelProps,
  DashboardPanelStatTextProps,
} from '../types';
import { getStatFormattedLegend } from './legend-utils';

export const checkIfDataNotAvailable = (chartData: {
  data: number[][];
  series: Series[];
}): boolean => {
  if (!chartData) {
    return null;
  }

  const { data, series } = chartData;
  if (data.length === 0 || series.length === 0) {
    return true;
  }

  if (data[0].length === 0) {
    return true;
  }

  return false;
};

export const getStatFontSize = (
  statLength: number,
  size: { width: number; height: number; heightContainer: number },
): number => {
  const { width, heightContainer } = size;
  const minFontSize = 12;
  const maxFontSize = 72;
  const averageCharWidth = width / statLength;
  const fontSize = averageCharWidth * 0.9;
  const font = clamp(fontSize, minFontSize, maxFontSize);

  return Math.min(font, heightContainer - 2);
};

export const statEvaluatedValue = ({
  panel,
  result,
}: {
  panel: DashboardPanelProps;
  result: Array<{ metric: { [key: string]: any }; value: [number, string] }>;
}): DashboardPanelStatTextProps => {
  let statObj: DashboardPanelStatTextProps = { color: '', text: '' };
  if (!result || !result[0]) {
    return statObj;
  }

  const { fieldConfig, targets } = panel;
  const { decimals, mappings, thresholds, unit } = fieldConfig?.defaults || {};
  const { metric, value: val } = result[0];
  const [timestamp, value] = val;

  if (!value) {
    return statObj;
  }

  const statLegend = getStatFormattedLegend(0, metric, targets);
  if (statLegend) {
    statObj = { ...statObj, name: statLegend };
  }

  if (mappings && mappings.length > 0) {
    const { color, text } = mappingValueToStat(value, mappings);

    if (color) {
      statObj = { ...statObj, color };
    }

    if (text && typeof text === 'string') {
      statObj = { ...statObj, text };
    }
  }

  if (unit && statObj.text === '') {
    const unitFormat = findUnitCategoryFormatById(unit);
    if (unitFormat && value) {
      const stat = unitFormat.fn(Number(value), decimals || 2);
      statObj = { ...statObj, ...stat };
    }
  }

  if (statObj.text === '') {
    statObj.text = toFixed(Number(value), decimals || 2);
  }

  if (statObj.color === '' && thresholds) {
    statObj.color = mappingValueToThresholdColor(value, thresholds);
  }

  statObj = {
    ...statObj,
    colorMode: panel.options?.colorMode || 'value',
    textMode: panel.options?.textMode || 'value',
  };
  return statObj;
};

export const mappingValueToStat = (
  value: string,
  mappings: DashboardPanelConfigMappingProps[],
): DashboardPanelStatTextProps => {
  const stat = { color: '', text: '' };
  const valueNumber = Number(value);

  if (mappings.length > 0) {
    mappings.forEach((mapping) => {
      const { options, type } = mapping;
      if (type === 'value') {
        const keys = Object.keys(options);
        keys.forEach((key) => {
          if (Number(key) === valueNumber) {
            const option = options[key];
            stat.color = option.color && option.color.replace('-', '');
            stat.text = option.text;
            return;
          }
        });
      }

      if (type === 'range') {
        const { from, to, result } = options;
        if (valueNumber >= from && valueNumber <= to) {
          stat.color = result?.color && result?.color.replace('-', '');
          stat.text = result.text;
          return;
        }
      }

      if (type === 'special') {
        const { match, result } = options;
        if (match === value) {
          stat.color = result.color && result.color.replace('-', '');
          stat.text = result.text;
          return;
        }
      }
    });
  }

  return stat;
};

export const mappingValueToThresholdColor = (
  value: string,
  thresholds: DashboardPanelConfigThresholdProps,
): string => {
  let color = '';
  const valueNumber = Number(value);
  const { steps } = thresholds;
  if (steps.length > 0) {
    steps.forEach((step) => {
      if (step.value === null || step.value === undefined) {
        color = step.color && step.color.replace('-', '');
        return;
      }
      if (valueNumber >= step.value) {
        color = step.color && step.color.replace('-', '');
        return;
      }
    });
  }

  return color;
};
