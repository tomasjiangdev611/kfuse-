import { useToggle } from 'hooks';
import React from 'react';

type Props = {
  searchedFacetValuesCount: number;
  showAllToggle: ReturnType<typeof useToggle>;
};

const FacetPickerValuesShowAllButton = ({
  searchedFacetValuesCount,
  showAllToggle,
}: Props) => {
  return (
    <div className="facet-picker__values__show-all">
      <button
        className="facet-picker__values__show-all__button link"
        onClick={showAllToggle.toggle}
        type="button"
      >
        {showAllToggle.value
          ? 'Show less'
          : `Show all (${searchedFacetValuesCount})`}
      </button>
    </div>
  );
};

export default FacetPickerValuesShowAllButton;
