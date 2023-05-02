import { Multiselect, Select } from 'components';
import React from 'react';
import { Zap } from 'react-feather';
import { AggregateTypes, AggregateTypesLabels } from 'types';

const aggreagationTypeOptions = [
  { label: 'None', value: null },
  ...Object.values(AggregateTypes).map((aggregateType) => ({
    label: AggregateTypesLabels[aggregateType],
    value: aggregateType,
  })),
];

const MetricsPickerItemAggregation = ({
  aggregateOn,
  aggregateType,
  availableDimensionNames,
  clearAggregation,
  onChangeHandler,
}) => {
  const dimensionNameOptions = availableDimensionNames.map(
    (dimensionName: string) => ({
      label: dimensionName,
      value: dimensionName,
    }),
  );

  return (
    <div className="metrics-picker__item__aggregation">
      <div className="metrics-picker__item__aggregation__left">
        <Zap size={18} />
      </div>
      <div className="metrics-picker__item__aggregation__right">
        <div className="field-group">
          <div className="field-group__item">
            <Select
              onChange={onChangeHandler('aggregateType')}
              options={aggreagationTypeOptions}
              placeholder="Aggregate"
              value={aggregateType}
            />
          </div>
          <div className="field-group__item metrics-picker__item__aggregation__field-group__item--aggregateOn">
            <Multiselect
              onChange={onChangeHandler('aggregateOn')}
              options={dimensionNameOptions}
              placeholder="All Dimensions"
              value={aggregateOn}
            />
          </div>
        </div>
      </div>
      <div className="metrics-picker__item___actions">
        {aggregateOn.length ? (
          <button
            className="link link--red link--bold"
            onClick={clearAggregation}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MetricsPickerItemAggregation;
