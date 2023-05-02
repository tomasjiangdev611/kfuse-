import React, { ReactElement, useEffect, useRef } from 'react';
import uPlot, { AlignedData } from 'uplot';

import {
  AggregateLegends,
  Legends,
  LegendsCompact,
  TooltipPlugin,
  TooltipPluginCompact,
  TooltipPluginMulti,
  ValueLegends,
} from './lib';
import {
  ChartRenderProps,
  ChartType,
  LegendTypes,
  TooltipTypes,
  UPlotConfig,
} from './types';
import { dataMatch, optionsUpdateState, mapMouseEventToMode } from './utils';

const UPlotChart = ({
  activeChart,
  options,
  data,
  layoutType,
  legend: { legendHeight, legendType },
  onLegendItemClick,
  tooltipType,
  unit,
}: {
  activeChart: ChartType;
  options: UPlotConfig;
  data: AlignedData;
  layoutType?: ChartRenderProps['layoutType'];
  legend: { legendHeight?: number; legendType?: LegendTypes };
  onLegendItemClick: (idx: number, mode: string) => void;
  tooltipType?: TooltipTypes;
  unit?: string;
}): ReactElement => {
  const chartRef = useRef<uPlot | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  function destroy(chart: uPlot | null) {
    if (chart) {
      chart.destroy();
      chartRef.current = null;
    }
  }
  function create() {
    const newChart = new uPlot(
      options,
      data,
      targetRef.current as HTMLDivElement,
    );
    chartRef.current = newChart;
  }

  useEffect(() => {
    create();
    return () => {
      destroy(chartRef.current);
    };
  }, []);

  const setSeriesVisibility = (e: React.MouseEvent, seriesIdx: number) => {
    const mode = mapMouseEventToMode(e);
    onLegendItemClick(seriesIdx, mode);
  };

  const onFocusSeries = (seriesIdx: number) => {
    const chart = chartRef.current;
    if (chart) {
      if (seriesIdx >= 0) {
        chart.setSeries(seriesIdx, { focus: true });
      } else {
        chart.setSeries(seriesIdx, null);
      }
    }
  };

  const prevProps = useRef({ options, data }).current;
  useEffect(() => {
    const chart = chartRef.current;
    if (prevProps.options !== options) {
      const optionsState = optionsUpdateState(prevProps.options, options);
      if (!chart || optionsState === 'create') {
        destroy(chart);
        create();
      } else if (optionsState === 'update') {
        chart.setSize({ width: options.width, height: options.height });
      } else {
        destroy(chart);
        create();
      }
    }
    if (prevProps.data !== data) {
      if (!chart) {
        create();
      } else if (!dataMatch(prevProps.data, data)) {
        chart.setData(data);
      }
    }

    return () => {
      prevProps.options = options;
      prevProps.data = data;
    };
  }, [options, data]);

  const getLegend = () => {
    if (legendType === LegendTypes.AGGREGATE) {
      return (
        <AggregateLegends
          config={options}
          data={data}
          onItemClick={(e, idx) => setSeriesVisibility(e, idx)}
          onFocusSeries={onFocusSeries}
          unit={unit}
        />
      );
    }
    if (legendType === LegendTypes.VALUES) {
      return (
        <ValueLegends
          config={options}
          data={data}
          onItemClick={(e, idx) => setSeriesVisibility(e, idx)}
          onFocusSeries={onFocusSeries}
          unit={unit}
        />
      );
    }
    if (legendType === LegendTypes.SIMPLE) {
      return (
        <Legends
          config={options}
          onItemClick={(e, idx) => setSeriesVisibility(e, idx)}
        />
      );
    }
    if (legendType === LegendTypes.COMPACT) {
      return (
        <LegendsCompact
          config={options}
          onItemClick={(e, idx) => setSeriesVisibility(e, idx)}
          legendHeight={legendHeight}
        />
      );
    }

    return null;
  };

  const getTooltip = () => {
    if (tooltipType === 'default') {
      return <TooltipPlugin config={options} data={data} unit={unit} />;
    }
    if (tooltipType === 'compact') {
      return (
        <TooltipPluginCompact
          chartType={activeChart}
          config={options}
          data={data}
          layoutType={layoutType}
          unit={unit}
        />
      );
    }
    if (tooltipType === 'multi') {
      return (
        <TooltipPluginMulti
          chartType={activeChart}
          config={options}
          data={data}
          layoutType={layoutType}
          unit={unit}
        />
      );
    }
    return null;
  };

  return (
    <>
      <div
        ref={targetRef}
        style={{
          cursor: ['Bar', 'Stacked Bar'].includes(activeChart)
            ? 'crosshair'
            : 'default',
        }}
      ></div>
      {data.length > 1 && getLegend()}
      {data.length > 1 && getTooltip()}
    </>
  );
};

export default UPlotChart;
