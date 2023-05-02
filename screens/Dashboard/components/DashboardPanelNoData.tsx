import React, { ReactElement, useMemo } from 'react';
import { Layout } from 'react-grid-layout';

import { getPanelWidthHeight, getStatFontSize } from '../utils';

const DashboardPanelNoData = ({
  baseWidth,
  gridPos,
  message,
}: {
  baseWidth: number;
  gridPos: Layout;
  message?: string;
}): ReactElement => {
  const panelSize = useMemo(
    () => getPanelWidthHeight(gridPos, baseWidth, 'title'),
    [gridPos, baseWidth],
  );
  const fontSize = useMemo(() => getStatFontSize(8, panelSize), [gridPos]);

  return (
    <div className="dashboard__panel__no-data">
      <p className="dashboard__panel__no-data__text" style={{ fontSize }}>
        {message || 'No data'}
      </p>
    </div>
  );
};

export default DashboardPanelNoData;
