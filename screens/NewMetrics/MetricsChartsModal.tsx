import { ChartRenderer } from 'components';
import { Datepicker } from 'composite';
import React, { ReactElement, useEffect, useState } from 'react';
import { X } from 'react-feather';
import ResizeObserver from 'rc-resize-observer';
import { decodePromqlToReadable } from 'utils';

import { useMetricsChartsModal } from './hooks';
import MetricsChartsModalToolbar from './MetricsChartsModalToolbar';
import { MetricsChartsModalProps } from './types';
import { getPromqlQueryByIndex, getSeriesShownState } from './utils';

const MetricsChartsModal = ({
  explorerDate,
  explorerData,
  onClose,
  queryItem,
}: MetricsChartsModalProps): ReactElement => {
  const [chartWidth, setChartWidth] = useState(1000);
  const metricsChartsModal = useMetricsChartsModal(explorerDate, queryItem);
  const { chartData, date, isLoading, setChartData, setDate, setSeriesBitmap } =
    metricsChartsModal;

  useEffect(() => {
    setChartData(explorerData);
  }, [explorerData]);

  const promql = decodePromqlToReadable(getPromqlQueryByIndex(queryItem, null));
  return (
    <div className="new-metrics__chart__modal">
      <div className="new-metrics__chart__modal__header">
        <div className="new-metrics__chart__modal__header__title">
          {promql.length > 70 ? `${promql.slice(0, 70)}...` : promql}
        </div>
        <div className="new-metrics__chart__modal__header__right">
          {explorerDate && (
            <div>
              <Datepicker
                absoluteTimeRangeStorage={null}
                className="logs__search__datepicker"
                hasStartedLiveTail={false}
                onChange={setDate}
                startLiveTail={null}
                value={date}
              />
            </div>
          )}
          <div
            className="new-metrics__chart__modal__header__right__close"
            onClick={onClose}
          >
            <X />
          </div>
        </div>
      </div>
      <div className="new-metrics__chart__modal__content">
        <ResizeObserver onResize={(size) => setChartWidth(size.width)}>
          <div className="new-metrics__chart__modal__content__left">
            <ChartRenderer
              date={date}
              chartData={chartData || { data: [], series: [] }}
              isLoading={isLoading}
              layoutType="dashboard"
              legend={{ legendType: 'aggregate' }}
              onSeriesShowHide={(series) =>
                setSeriesBitmap(getSeriesShownState(series))
              }
              tooltipType="compact"
              size={{ width: chartWidth }}
              styles={{ boxShadow: false }}
              unit="number"
            />
          </div>
        </ResizeObserver>
        <MetricsChartsModalToolbar metricsChartsModal={metricsChartsModal} />
      </div>
    </div>
  );
};

export default MetricsChartsModal;
