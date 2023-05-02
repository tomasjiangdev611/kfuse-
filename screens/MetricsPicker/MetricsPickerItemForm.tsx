import { Autocomplete } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { promqlLabels } from 'requests';
import { AggregateTypes } from 'types';
import MetricsPickerItemDimensionFilters from './MetricsPickerItemDimensionFilters';
import MetricsPickerItemAggregation from './MetricsPickerItemAggregation';

const metricOptions = (metrics) =>
  metrics.map((metric) => ({
    label: metric,
    value: metric,
  }));

const MetricsPickerItemForm = ({
  entityTypeOptions,
  isLastMetric,
  index,
  metrics,
  onChange,
  removeMetric,
  value,
}) => {
  const { aggregateOn, aggregateType, metricName } = value;

  const getAllDimensionValuesByMetricNameForMetricRequest =
    useRequest(promqlLabels);

  const dimensionFilters = value.dimensionFilters || [];

  const onChangeHandler = (key: string) => (nextValue: any) => {
    onChange({ ...value, [key]: nextValue });
  };

  const onChangeMetricName = (nextMetricName: string) => {
    onChange({
      ...value,
      aggregateOn: [],
      dimensionFilters: [],
      metricName: nextMetricName,
    });
    getAllDimensionValuesByMetricNameForMetricRequest.call(nextMetricName);
  };

  useEffect(() => {
    if (metricName) {
      getAllDimensionValuesByMetricNameForMetricRequest.call(metricName);
    }
  }, []);

  const availableDimensionNames =
    getAllDimensionValuesByMetricNameForMetricRequest.result
      ? Object.keys(
          getAllDimensionValuesByMetricNameForMetricRequest.result,
        ).sort()
      : [];

  const availableDimensionValuesByDimensionName =
    getAllDimensionValuesByMetricNameForMetricRequest.result || {};

  const clearAggregation = () => {
    onChange({ ...value, aggregateOn: [], aggregateType: AggregateTypes.avg });
  };

  const clearDimensionFilters = () => {
    onChange({ ...value, dimensionFilters: [] });
  };

  return (
    <div className="metrics-picker__item__inner">
      <div className="metrics-picker__item__metric">
        <div className="metrics-picker__item__metric__field">
          <div className="field-group">
            <div className="field-group__item">
              <div className="field-group__item__label field-group__item__label--primary">
                {(index + 10).toString(36).toUpperCase()}
              </div>
            </div>
            <div className="field-group__item metrics-picker__item__field--metricName">
              <Autocomplete
                onChange={onChangeMetricName}
                options={metricOptions(metrics)}
                placeholder="Pick a Metric"
                value={metricName}
              />
            </div>
          </div>
        </div>
        <div className="metrics-picker__item___actions">
          {removeMetric ? (
            <button
              className="link link--red link--bold"
              onClick={removeMetric}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <MetricsPickerItemAggregation
        aggregateOn={aggregateOn}
        aggregateType={aggregateType}
        availableDimensionNames={availableDimensionNames}
        clearAggregation={clearAggregation}
        onChangeHandler={onChangeHandler}
      />
      <MetricsPickerItemDimensionFilters
        availableDimensionNames={availableDimensionNames}
        availableDimensionValuesByDimensionName={
          availableDimensionValuesByDimensionName
        }
        clearDimensionFilters={clearDimensionFilters}
        dimensionFilters={dimensionFilters}
        metricName={metricName}
        onChange={onChangeHandler('dimensionFilters')}
      />
    </div>
  );
};

export default MetricsPickerItemForm;
