import { Autocomplete, Select } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { Filter, X } from 'react-feather';
import { getDimensionValuesForMetric } from 'requests';
import { defaultDimensionFilter, DimensionFilter } from 'types';

const isEqualOptions = [
  { label: '=', value: true },
  { label: '\u2260', value: false },
];

const isOrOptions = [
  { label: 'And', value: false },
  { label: 'Or', value: true },
];

type Props = {
  addDimensionFilter: () => void;
  dimensionFilter?: DimensionFilter;
  dimensionNameOptions: any[];
  index: number;
  isLast?: boolean;
  metricName: string;
  onChange: (dimensionFilter: DimensionFilter) => void;
  removeDimensionFilter?: () => void;
  showOrSelect?: boolean;
};

const MetricsPickerItemDimensionFilter = ({
  addDimensionFilter,
  dimensionFilter = defaultDimensionFilter,
  dimensionNameOptions,
  index,
  isLast,
  metricName,
  onChange,
  removeDimensionFilter,
  showOrSelect,
}: Props): ReactElement => {
  const getDimensionValuesForMetricRequest = useRequest(
    getDimensionValuesForMetric,
  );

  const { dimensionName, dimensionValue, isEqual, isOr } = dimensionFilter;

  const onChangeHandler = (key: string) => (value: any) => {
    onChange({ ...dimensionFilter, [key]: value });
  };

  const onChangeDimensionName = (nextDimensionName: string) => {
    onChangeHandler('dimensionName')(nextDimensionName);
    getDimensionValuesForMetricRequest.call(metricName, nextDimensionName);
  };

  useEffect(() => {
    if (dimensionName) {
      getDimensionValuesForMetricRequest.call(metricName, dimensionName);
    }
  }, []);

  return (
    <div className="metrics-picker__item__dimension-filter">
      <div className="metrics-picker__item__dimension-filter__left">
        {index === 0 ? (
          <Filter
            className="metrics-picker__item__dimension-filter__icon"
            size={18}
          />
        ) : null}
      </div>
      <div className="metrics-picker__item__dimension-filter__right">
        <div className="field-group metrics-picker__item__dimension-filter__field-group">
          {showOrSelect ? (
            <div className="field-group__item metrics-picker__item__dimension-filter__field-group__item--isOr">
              <Select
                onChange={onChangeHandler('isOr')}
                options={isOrOptions}
                value={isOr || false}
              />
            </div>
          ) : null}
          <div className="field-group__item metrics-picker__item__dimension-filter__field-group__item--dimensionName">
            <Select
              onChange={onChangeDimensionName}
              options={dimensionNameOptions}
              placeholder="Dimension"
              value={dimensionName}
            />
          </div>
          <div className="field-group__item">
            <Select
              onChange={onChangeHandler('isEqual')}
              options={isEqualOptions}
              value={isEqual}
            />
          </div>
          <div className="field-group__item metrics-picker__item__dimension-filter__field-group__item--dimensionValues">
            <Autocomplete
              onChange={onChangeHandler('dimensionValue')}
              options={(getDimensionValuesForMetricRequest.result || []).map(
                (dimensionValue: string) => ({
                  label: dimensionValue,
                  value: dimensionValue,
                }),
              )}
              value={dimensionValue}
            />
          </div>
        </div>
        {isLast ? (
          <div className="metrics-picker__item__dimension-filter__add">
            <button className="link" onClick={addDimensionFilter}>
              Add another dimension filter
            </button>
          </div>
        ) : null}
      </div>
      <div className="metrics-picker__item__dimension-filter__actions">
        {removeDimensionFilter ? (
          <button
            className="metrics-picker__item__dimension-filter__action"
            onClick={removeDimensionFilter}
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MetricsPickerItemDimensionFilter;
