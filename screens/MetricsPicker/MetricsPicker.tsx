import { Input } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle } from 'react-feather';
import { getEntityTypes, promqlMetadata } from 'requests';
import { defaultMetric } from 'types';
import MetricsPickerItem from './MetricsPickerItem';

const entityTypeOptions = (entityTypes) =>
  entityTypes.map((entityType) => ({
    label: entityType,
    value: entityType,
  }));

const MetricsPicker = ({ formulaInput, metrics, metricsInput }) => {
  const entityTypesRequest = useRequest(getEntityTypes);

  const addMetric = () => {
    const { onChange, value } = metricsInput;
    onChange([...value, defaultMetric]);
  };

  const onChangeHandler = (i) => (metric) => {
    const { onChange, value } = metricsInput;
    const nextValue = [...value];
    nextValue[i] = metric;

    onChange(nextValue);
  };

  const removeMetricHandler = (i) => () => {
    const { onChange, value } = metricsInput;
    const nextValue = [...value];
    nextValue.splice(i, 1);

    onChange(nextValue);
  };

  useEffect(() => {
    entityTypesRequest.call();
  }, []);

  return (
    <div className="metrics-picker">
      {metricsInput.value.map((metric, i) => (
        <MetricsPickerItem
          addMetric={addMetric}
          entityTypeOptions={entityTypeOptions(entityTypesRequest.result || [])}
          index={i}
          isLastMetric={i === metricsInput.value.length - 1}
          metrics={metrics}
          onChange={onChangeHandler(i)}
          removeMetric={metricsInput.value.length > 1 ? removeMetricHandler(i) : null}
          value={metric}
        />
      ))}
      <div className="metrics-picker__footer">
        <div className="field-group">
          <div className="field-group__item">
            <div className="field-group__item__label">Formula</div>
          </div>
          <div className="field-group__item">
            <Input
              {...formulaInput}
              placeholder="e.g. 2 * A + B"
              type="text"
            />
          </div>
        </div>
        <button
          className="metrics-picker__add-metric-button button"
          onClick={addMetric}
        >
          <PlusCircle className="button__icon" size={14} />
          Add Metric
        </button>
      </div>
    </div>
  );
};

export default MetricsPicker;
