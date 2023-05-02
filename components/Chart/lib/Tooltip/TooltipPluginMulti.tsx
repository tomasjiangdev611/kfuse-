import React, { ReactElement } from 'react';
import { AlignedData } from 'uplot';

import CompactTooltipContainer from './CompactTooltipContainer';
import { SeriesTable } from '../components';
import { useTooltipPlugin } from './hooks';
import {
  getCursorTimestamp,
  getCursorValue,
  getLabelColor,
  getLabelFromSeries,
} from '../../utils';
import { ChartType, ChartRenderProps, UPlotConfig } from '../../types';

const TooltipPluginMulti = ({
  chartType,
  config,
  data,
  layoutType,
  unit,
}: {
  chartType: ChartType;
  config: UPlotConfig;
  data: AlignedData;
  layoutType: ChartRenderProps['layoutType'];
  unit?: string;
}): ReactElement => {
  const { coords, focusedPointIdx, focusedSeriesIdx, isActive } =
    useTooltipPlugin(chartType, config, layoutType);

  const renderMultiTooltip = () => {
    const seriesData = [];
    for (let seriesId = 1; seriesId < data.length; seriesId++) {
      const label = getLabelFromSeries(config.series, seriesId);
      const value = getCursorValue(data, seriesId, focusedPointIdx);

      seriesData.push({
        label,
        value,
        color: getLabelColor(config.series, seriesId),
        isActive: seriesId === focusedSeriesIdx,
      });
    }

    return (
      <CompactTooltipContainer
        classname="uplot__tooltip-plugin_multi"
        coords={coords}
      >
        <SeriesTable
          timestamp={getCursorTimestamp(data, focusedPointIdx)}
          series={seriesData}
          unit={unit}
        />
      </CompactTooltipContainer>
    );
  };

  return (
    <>{isActive && coords && focusedPointIdx && <>{renderMultiTooltip()}</>}</>
  );
};

export default TooltipPluginMulti;
