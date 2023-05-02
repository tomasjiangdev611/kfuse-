import classnames from 'classnames';
import React, { useEffect } from 'react';
import { Select } from 'components';
import { useForm, useRequest } from 'hooks';
import { EntityTypes } from 'types';

const entityTypeOptions = Object.keys(EntityTypes).map((key) => ({
  label: key,
  value: key,
}));

const metricOptions = (metrics) =>
  metrics.map((metric) => ({
    label: metric.name.split('.').join(' ').replace(/_/g, ' '),
    value: metric.name,
  }));
const periodOptions = [
  { label: 'Last 5 minutes', value: 60 * 5 },
  { label: 'Last 30 minutes', value: 60 * 30 },
  { label: 'Last Hour', value: 60 * 60 },
  { label: 'Last 6 Hours', value: 60 * 60 * 6 },
  { label: 'Last 12 Hours', value: 60 * 60 * 12 },
  { label: 'Last Day', value: 60 * 60 * 24 },
  { label: 'Last 7 Days', value: 60 * 60 * 24 * 7 },
];

type Props = {
  addMetricTab: (args: { entityType: string; metric: string }) => void;
  form: ReturnType<typeof useForm>;
  searchMetricsRequest: ReturnType<typeof useRequest>;
};

const MetricsHeader = ({ addMetricTab, form, searchMetricsRequest }: Props) => {
  const onClick = () => {
    addMetricTab({
      entityType: form.values.entityType,
      metric: form.values.metric,
    });
  };

  return (
    <div className="metrics__header">
      <div className="metrics__header__item">
        <div className="metrics__header__item__label">Entity Type</div>
        <div className="metrics__header__item__input">
          <Select
            className="select-naked"
            options={entityTypeOptions}
            {...form.propsByKey('entityType')}
          />
        </div>
      </div>
      <div className="metrics__header__item metrics__header__item--metric">
        <div className="metrics__header__item__label">Metric</div>
        <div className="metrics__header__item__input">
          <Select
            className="select-naked"
            options={metricOptions(searchMetricsRequest.result || [])}
            placeholder={
              searchMetricsRequest.result && searchMetricsRequest.result.length
                ? 'Select a metric'
                : `No available metrics ${
                    form.values.entityType
                      ? ` for ${form.values.entityType}`
                      : ''
                  }`
            }
            {...form.propsByKey('metric')}
          />
        </div>
      </div>
      <div className="metrics__header__actions">
        <button
          className={classnames({
            button: true,
            'button--primary': true,
            'button--disabled': !form.values.entityType || !form.values.metric,
          })}
          onClick={onClick}
        >
          Add Metric
        </button>
      </div>
      <div className="metrics__header__item">
        <div className="metrics__header__item__label">Period</div>
        <div className="metrics__header__item__input">
          <Select
            className="select-naked"
            options={periodOptions}
            {...form.propsByKey('secondsFromNow')}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsHeader;
