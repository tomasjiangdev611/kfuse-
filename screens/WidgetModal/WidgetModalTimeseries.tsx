import React from 'react';
import { Select } from 'components';
import {
  SecondsFromNow,
  SecondsFromNowLabels,
  SecondsFromNowValues,
} from 'types';
import { WidgetTimeseries } from '../Widgets';
import MetricsPicker from '../MetricsPicker';

const secondsFromNowOptions = Object.keys(SecondsFromNow).map(
  (secondsFromNow) => ({
    label: SecondsFromNowLabels[secondsFromNow],
    value: SecondsFromNowValues[secondsFromNow],
  }),
);

const WidgetModalTimeseries = ({ form }) => {
  const { propsByKey, values } = form;
  const { metrics } = values;

  const filteredMetricNames = metrics
    .filter((metric) => metric.metricName)
    .map((metric) => metric.metricName);

  return (
    <>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Metrics</div>
        <MetricsPicker
          formulaInput={propsByKey('formula')}
          metricsInput={propsByKey('metrics')}
        />
      </div>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Time</div>
        <Select
          options={secondsFromNowOptions}
          placeholder="Time period"
          {...propsByKey('secondsFromNow')}
        />
      </div>
      <div className="widget-modal__section">
        <div className="widget-modal__section__header">Preview</div>

        {filteredMetricNames.length ? (
          <div className="widget-modal__chart">
            <WidgetTimeseries widget={form.values} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default WidgetModalTimeseries;
