import classNames from 'classnames';
import { Loader, useThemeContext } from 'components';
import React, { ReactElement, useEffect, useState } from 'react';

import ChartRendererToolbar from './ChartRendererToolbar';
import getConfig from './ChartConfigBuilder';
import { ChartRenderProps, ChartType, StrokeType, UPlotConfig } from './types';
import UPlotChart from './UPlotChart';
import { getNoDataPlaceholder, getStrokeLineConfig } from './utils';

const checkAllSelected = (series: UPlotConfig['series']): boolean => {
  return series.every(({ show }) => show);
};

const SERIES_LIMIT = 20;

const ChartRenderer = ({
  bands,
  size: { width, height },
  unit = 'number',
  chartTypes,
  date,
  chartData,
  hooks,
  isLoading,
  layoutType = 'explore',
  legend = {},
  onSeriesShowHide,
  styles = {},
  strokeType,
  tooltipType = 'default',
  toolbar = {},
}: ChartRenderProps): ReactElement => {
  const [config, setConfig] = useState<UPlotConfig>(null);
  const [data, setData] = useState<any>([]);
  const [activeChart, setActiveChart] = useState<ChartType>(
    chartTypes ? chartTypes[0] : 'Line',
  );
  const [showAll, setShowAll] = useState<boolean>(false);
  const [activeStroke, setActiveStroke] = useState<StrokeType>(strokeType);
  const { darkModeEnabled } = useThemeContext();

  const onLegendItemClick = (idx: number, mode: string) => {
    if (mode === 'append') {
      config.series[idx].show = !config.series[idx].show;
    } else if (config.series[idx].show && !checkAllSelected(config.series)) {
      config.series.forEach((_, i) => {
        config.series[i].show = true;
      });
    } else {
      config.series.forEach((_, i) => {
        config.series[i].show = i === idx;
      });
    }
    setConfig({ ...config });
    onSeriesShowHide && onSeriesShowHide(config.series);
  };

  const getConfigAndData = (isShowAll: boolean) => {
    const { data, maxValue, series } = chartData;

    let newData = [];
    let newSeries = [];
    if (!isShowAll && layoutType === 'explore') {
      newData = [...data].slice(0, SERIES_LIMIT + 1);
      newSeries = [...series].slice(0, SERIES_LIMIT);
    } else {
      newData = [...data];
      newSeries = [...series];
    }

    const strokeConfig = getStrokeLineConfig(activeStroke);
    const newChartStyles = styles.chartStyles || {};
    const newConfig = getConfig({
      bands,
      unit,
      chartStyles: { ...newChartStyles, ...strokeConfig },
      darkModeEnabled,
      data: newData,
      hooks,
      maxValue,
      series: newSeries,
      size: { width, height: height || 340 },
      type: activeChart,
    });

    return { data: newData, newConfig };
  };

  useEffect(() => {
    const isShowAll = chartData.data.length < SERIES_LIMIT;
    if (isShowAll) {
      setShowAll(false);
    }

    const { data, newConfig } = getConfigAndData(isShowAll);
    if (data.length === 0 && date) {
      setData(getNoDataPlaceholder(date));
      setConfig(newConfig);
    } else {
      setData(data);
      setConfig(newConfig);
    }
  }, [chartData, activeChart, activeStroke, darkModeEnabled]);

  useEffect(() => {
    if (config) {
      setConfig({
        ...config,
        width: width ? width : config.width,
        height: height ? height : config.height,
      });
    }
  }, [width, height]);

  const showAllSeries = () => {
    setShowAll(true);
    const { data, newConfig } = getConfigAndData(true);
    setData([...data]);
    setConfig(newConfig);
  };

  return (
    <Loader isLoading={isLoading}>
      {config ? (
        <div
          className={classNames({
            'uplot__chart-renderer': true,
            'box-shadow': styles.boxShadow || false,
          })}
        >
          {!showAll &&
            chartData.data.length > SERIES_LIMIT &&
            layoutType === 'explore' && (
              <div className="uplot__chart-renderer__show-all">
                Only 20 series is shown by default &nbsp;
                <a
                  className="uplot__chart-renderer__show-all__button"
                  onClick={showAllSeries}
                >
                  Show All
                </a>
              </div>
            )}
          <ChartRendererToolbar
            activeChart={activeChart}
            chartTypes={chartTypes}
            setActiveChart={setActiveChart}
            setActiveStroke={setActiveStroke}
            activeStroke={activeStroke}
            toolbar={toolbar}
          />
          <UPlotChart
            activeChart={activeChart}
            options={config}
            data={data}
            layoutType={layoutType}
            legend={legend}
            onLegendItemClick={onLegendItemClick}
            tooltipType={tooltipType}
            unit={unit}
          />
        </div>
      ) : (
        !isLoading && <div className="uplot__noseries ">No series found</div>
      )}
    </Loader>
  );
};

export default ChartRenderer;
