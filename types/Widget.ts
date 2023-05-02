import { defaultMetric, Metric } from './Metric';
import { SecondsFromNow, SecondsFromNowValues } from './SecondsFromNow';
import WidgetTypes from './WidgetTypes';

export const defaultWidget: Widget = {
  formula: '',
  metrics: [defaultMetric],
  secondsFromNow: SecondsFromNowValues[SecondsFromNow.Last5Minutes],
  widgetType: WidgetTypes.Timeseries,
};

export type Widget = {
  formula?: string;
  metrics: Metric[];
  secondsFromNow: number;
  widgetType: WidgetTypes;
};
