import { Loader, Table } from 'components';
import React, { ReactElement, useEffect, useState } from 'react';

import { useDashboardDataLoader } from '../hooks';
import { DashboardPanelComponentProps } from '../types';
import {
  getActivePromqlQueryRefId,
  getTableColumns,
  organizeTableData,
} from '../utils';

const DashboardPanelTable = ({
  baseWidth,
  dashboardState,
  dashboardTemplateState,
  isInView,
  nestedIndex,
  panel,
  panelIndex,
}: DashboardPanelComponentProps): ReactElement => {
  const [tableData, setTableData] = useState<any[]>([]);
  const { templateValues } = dashboardTemplateState;

  const dashboardDataLoader = useDashboardDataLoader({
    baseWidth,
    dashboardState,
    isInView,
    nestedIndex,
    panelIndex,
    templateValues,
    type: 'unflattened',
  });

  useEffect(() => {
    if (!dashboardDataLoader.result) {
      return;
    }

    const activePromqlQueryRefId = getActivePromqlQueryRefId(panel.targets);
    const transformedData = organizeTableData(
      activePromqlQueryRefId,
      dashboardDataLoader.result,
      panel.fieldConfig.overrides,
      panel.transformations,
    );
    setTableData(transformedData);
  }, [dashboardDataLoader.result]);

  return (
    <Loader isLoading={dashboardDataLoader.isLoading}>
      <div className="dashboard__panel__table">
        {tableData && tableData.length > 0 && (
          <Table
            className="dashboard__panel__table__table"
            columns={getTableColumns(tableData, panel.transformations)}
            isStickyHeaderEnabled={true}
            rows={tableData}
          />
        )}
      </div>
    </Loader>
  );
};

export default DashboardPanelTable;
