import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';
import { DashboardPanelType } from '../types';

import { GraphWidgetList } from '../utils/widget-list-utils';

const VisualizationTypesList = ({
  onChange,
  widgetType,
}: {
  onChange?: (val: string) => void;
  widgetType?: DashboardPanelType;
}): ReactElement => {
  const [visualizationType, setVisualizationType] = useState('timeseries');

  useEffect(() => {
    setVisualizationType(widgetType);
  }, [widgetType]);
  return (
    <div className="dashboard__widget__visualization">
      {GraphWidgetList.map(({ name, label }) => {
        return (
          <div
            className={classNames({
              dashboard__widget__visualization__item: true,
              'dashboard__widget__visualization__item--active':
                visualizationType === name,
            })}
            key={name}
            onClick={() => {
              setVisualizationType(name);
              onChange && onChange(name);
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default VisualizationTypesList;
