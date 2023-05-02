import { Checkbox, PopoverTrigger } from 'components';
import React, { ReactElement, ReactNode } from 'react';
import { SelectedFacetValues } from 'types';
import { convertNumberToReadableUnit, getIsDeselecting } from 'utils';
import FacetPickerValuesItemPopoverPanel from './FacetPickerValuesItemPopoverPanel';

type Props = {
  count: number;
  excludeFacetValue: (value: string) => void;
  renderValue: (value: string) => ReactNode;
  selectedFacetValues: SelectedFacetValues;
  selectOnlyFacetValue: (value: string) => void;
  toggleFacetValue: (value: string) => void;
  value: string;
};

const FacetPickerValuesItem = ({
  count,
  excludeFacetValue,
  selectOnlyFacetValue,
  renderValue,
  selectedFacetValues,
  toggleFacetValue,
  value,
}: Props): ReactElement => {
  const isDeselecting = getIsDeselecting(selectedFacetValues);
  const onChange = () => {
    toggleFacetValue(value);
  };

  return (
    <div className="facet-picker__values__item">
      <Checkbox
        onChange={onChange}
        value={
          isDeselecting
            ? !(value in selectedFacetValues)
            : Boolean(selectedFacetValues[value])
        }
      />
      <PopoverTrigger
        className="facet-picker__values__item__label"
        component={FacetPickerValuesItemPopoverPanel}
        props={{ excludeFacetValue, selectOnlyFacetValue, value }}
      >
        {renderValue ? renderValue(value) : value}
      </PopoverTrigger>
      <div className="facet-picker__values__item__count">
        {count ? convertNumberToReadableUnit(count) : '-'}
      </div>
    </div>
  );
};

export default FacetPickerValuesItem;
