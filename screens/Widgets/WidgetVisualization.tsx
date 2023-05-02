import React from 'react';
import { WidgetTypes } from 'types';
import WidgetDistribution from './WidgetDistribution';
import WidgetHexbin from './WidgetHexbin';
import WidgetPie from './WidgetPie';
import WidgetScatter from './WidgetScatter';
import WidgetTimeseries from './WidgetTimeseries';

const Widget = ({ widget }) => {
  const { widgetType } = widget;

  switch (widgetType) {
    case WidgetTypes.Distribution:
      return <WidgetDistribution />;
    case WidgetTypes.Hexbin:
      return <WidgetHexbin />;
    case WidgetTypes.Pie:
      return <WidgetPie />;
    case WidgetTypes.Scatter:
      return <WidgetScatter />;
    case WidgetTypes.Timeseries:
      return <WidgetTimeseries widget={widget} />;
    default:
      return null;
  }
};

export default Widget;
