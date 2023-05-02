import { Multiselect } from 'components';
import React, { ReactElement, useMemo } from 'react';
import { Filter } from 'react-feather';
import { DimensionFilter } from 'types';

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

type Props = {
  availableDimensionValuesByDimensionName: any;
  clearDimensionFilters: () => void;
  dimensionFilters: DimensionFilter[];
  onChange: (dimensionFilters: DimensionFilter[]) => void;
};

const MetricsPickerItemDimensionFilters = ({
  availableDimensionValuesByDimensionName,
  clearDimensionFilters,
  dimensionFilters,
  onChange,
}: Props): ReactElement => {
  const options = useMemo(
    () =>
      Object.keys(availableDimensionValuesByDimensionName).reduce(
        (arr, dimensionName) =>
          [
            ...arr,
            ...availableDimensionValuesByDimensionName[dimensionName].map(
              (dimensionValue) => {
                const value = `${dimensionName}:${dimensionValue}`;
                return {
                  label: `${value} (${randomIntFromInterval(0, 1000)})`,
                  value,
                };
              },
            ),
          ].sort((a, b) => a.value.localeCompare(b.value)),
        [],
      ),
    [availableDimensionValuesByDimensionName],
  );

  const onChangeDimensionFilters = (values) => {
    onChange(
      values.map((value) => {
        const [dimensionName, ...dimensionValueParts] = value.split(':');
        const dimensionValue = dimensionValueParts.join(':');
        return {
          isEqual: true,
          isOr: false,
          dimensionName,
          dimensionValue,
        };
      }),
    );
  };

  const value = dimensionFilters.map(
    ({ dimensionName, dimensionValue }) => `${dimensionName}:${dimensionValue}`,
  );

  return (
    <div className="metrics-picker__item__dimension-filters">
      <div className="metrics-picker__item__dimension-filter">
        <div className="metrics-picker__item__dimension-filter__left">
          <Filter
            className="metrics-picker__item__dimension-filter__icon"
            size={18}
          />
        </div>
        <div className="metrics-picker__item__dimension-filter__right">
          <div className="field-group">
            <div className="field-group__item field-group__item--flex">
              <Multiselect
                onChange={onChangeDimensionFilters}
                options={options}
                placeholder="Filter On"
                value={value}
              />
            </div>
          </div>
        </div>
        <div className="metrics-picker__item___actions">
          {value.length ? (
            <button
              className="link link--red link--bold"
              onClick={clearDimensionFilters}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MetricsPickerItemDimensionFilters;
