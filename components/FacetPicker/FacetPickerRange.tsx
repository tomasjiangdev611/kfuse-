import { RangeSlider } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { SelectedFacetRange } from 'types';

type Props = {
  changeFacetRange: (range: { lower: number; upper: number }) => void;
  getFacetValuesRequest: ReturnType<typeof useRequest>;
  lastRefreshedAt: Date;
  selectedFacetRange: SelectedFacetRange;
};

const FacetPickerRange = ({
  changeFacetRange,
  getFacetValuesRequest,
  lastRefreshedAt,
  selectedFacetRange,
}: Props) => {
  useEffect(() => {
    getFacetValuesRequest.call();
  }, [lastRefreshedAt]);

  const max =
    getFacetValuesRequest.result && getFacetValuesRequest.result.length
      ? Math.max(1, getFacetValuesRequest.result[0].value)
      : 10;

  const value = selectedFacetRange || { lower: 0, upper: max || 100 };

  return (
    <div className="facet-picker__range">
      <RangeSlider
        onChange={changeFacetRange}
        min={0}
        max={max}
        value={value}
      />
    </div>
  );
};

export default FacetPickerRange;
