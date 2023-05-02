import React, { ReactElement } from 'react';
import { AlignedData } from 'uplot';

import CompactTooltipContainer from './CompactTooltipContainer';
import CompactTooltipText from './CompactTooltipText';
import { useTooltipPlugin } from './hooks';
import {
  getCursorTimestamp,
  getCursorValue,
  getLabelColor,
  getLabelFromSeries,
  tooltipFormatter,
} from '../../utils';
import { ChartType, ChartRenderProps, UPlotConfig } from '../../types';

const TooltipPluginCompact = ({
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

  const renderTooltip = () => {
    const val = getCursorValue(data, focusedSeriesIdx, focusedPointIdx);
    return (
      <CompactTooltipContainer coords={coords}>
        <CompactTooltipText
          color={getLabelColor(config.series, focusedSeriesIdx) as string}
          label={getLabelFromSeries(config.series, focusedSeriesIdx)}
          position={coords.position}
          value={tooltipFormatter(val, unit)}
          timestamp={getCursorTimestamp(data, focusedPointIdx)}
        />
      </CompactTooltipContainer>
    );
  };

  return (
    <>
      {isActive &&
        coords &&
        focusedSeriesIdx &&
        focusedPointIdx &&
        renderTooltip()}
    </>
  );
};

export default TooltipPluginCompact;
