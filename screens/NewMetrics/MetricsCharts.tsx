import {
  ChartRenderer,
  SizeObserver,
  TooltipTrigger,
  useModalsContext,
} from 'components';
import React, { ReactElement, useMemo } from 'react';
import { DateSelection, MetricsQueriesDataProps } from 'types';
import { combineQueriesData, decodePromqlToReadable } from 'utils';

import MetricsChartsModal from './MetricsChartsModal';
import MetricsChartsRightToolbar from './MetricsChartsRightToolbar';
import { MetricsChartsQueryItemProps } from './types';
import { getPromqlQueryByIndex, onCreateAlert } from './utils';

const MetricsCharts = ({
  date,
  isLoading,
  queryData,
  queryItem,
}: {
  date: DateSelection;
  isLoading: boolean;
  queryData: MetricsQueriesDataProps;
  queryItem: MetricsChartsQueryItemProps;
}): ReactElement => {
  const chartModal = useModalsContext();

  const combinedData = useMemo(() => {
    const { formulas, queries, queryIndex, type } = queryItem;
    const onlyOneData: { [key: string]: any } = {};
    Object.keys(queryData).forEach((key) => {
      if (key.startsWith(`${type}_${queryIndex}`)) {
        onlyOneData[key] = queryData[key];
      }
    });
    return combineQueriesData(formulas, queries, onlyOneData);
  }, [queryData]);

  const onViewFullscreen = () => {
    chartModal.push(
      <MetricsChartsModal
        explorerDate={date}
        explorerData={combinedData}
        onClose={() => chartModal.pop()}
        queryItem={queryItem}
      />,
    );
  };

  const promql = decodePromqlToReadable(getPromqlQueryByIndex(queryItem, null));

  return (
    <SizeObserver>
      {({ width: chartWidth }) => (
        <ChartRenderer
          bands={combinedData.bands || []}
          date={date}
          chartData={combinedData}
          isLoading={isLoading}
          legend={{ legendType: 'simple' }}
          size={{ width: chartWidth, height: 260 }}
          tooltipType="compact"
          toolbar={{
            leftToolbar: (
              <TooltipTrigger tooltip={promql}>
                <div className="new-metrics__chart__left-toolbar__title">
                  {promql.length > 50
                    ? `${promql.slice(
                        0,
                        Math.floor((chartWidth * 0.7) / 8),
                      )}...`
                    : promql}
                </div>
              </TooltipTrigger>
            ),
            rightToolbar: (
              <MetricsChartsRightToolbar
                onCreateAlert={() => onCreateAlert(date, queryItem)}
                onViewFullscreen={onViewFullscreen}
              />
            ),
            toolbarMenuType: 'dropdown',
          }}
          unit="number"
        />
      )}
    </SizeObserver>
  );
};

export default MetricsCharts;
