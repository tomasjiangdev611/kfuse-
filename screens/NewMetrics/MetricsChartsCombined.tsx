import { ChartRenderer, SizeObserver, useModalsContext } from 'components';
import React, { ReactElement, useMemo } from 'react';
import {
  DateSelection,
  ExplorerQueryProps,
  FormulaProps,
  MetricsQueriesDataProps,
} from 'types';
import { combineQueriesData } from 'utils/MetricsQueryBuilder';

import MetricsChartsModal from './MetricsChartsModal';
import MetricsChartsRightToolbar from './MetricsChartsRightToolbar';
import { onCreateAlertCombined } from './utils';

const MetricsChartsCombined = ({
  date,
  formulas,
  queries,
  queryData,
}: {
  date: DateSelection;
  formulas: FormulaProps[];
  queries: ExplorerQueryProps[];
  queryData: MetricsQueriesDataProps;
}): ReactElement => {
  const chartModal = useModalsContext();
  const combinedData = useMemo(
    () => combineQueriesData(formulas, queries, queryData),
    [queryData],
  );

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

  return (
    <SizeObserver>
      {({ width: chartWidth }) => (
        <ChartRenderer
          bands={combinedData.bands || []}
          date={date}
          chartData={combinedData}
          isLoading={combinedData.isLoading}
          legend={{ legendType: 'simple' }}
          size={{ width: chartWidth, height: 360 }}
          tooltipType="compact"
          toolbar={{
            rightToolbar: (
              <MetricsChartsRightToolbar
                onCreateAlert={() =>
                  onCreateAlertCombined(date, formulas, queries)
                }
                onViewFullscreen={onViewFullscreen}
              />
            ),
            toolbarMenuType: 'button',
          }}
          unit="number"
        />
      )}
    </SizeObserver>
  );
};

export default MetricsChartsCombined;
