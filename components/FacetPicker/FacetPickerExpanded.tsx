import React from 'react';
import { getIsRangeFacet } from 'utils';
import FacetPickerRange from './FacetPickerRange';
import FacetPickerValues from './FacetPickerValues';

type Props = {
  changeFacetRange: (value: number) => void;
  disableSearch: any;
  excludeFacetValue: any;
  getFacetValuesRequest: any;
  lastRefreshedAt: any;
  name: any;
  renderedName: any;
  renderPlaceholderText: any;
  renderValue: any;
  selectOnlyFacetValue: any;
  selectedFacetRange: any;
  selectedFacetValues: any;
  toggleFacetValue: any;
};

const FacetPickerExpanded = ({
  changeFacetRange,
  disableSearch,
  excludeFacetValue,
  getFacetValuesRequest,
  lastRefreshedAt,
  name,
  renderedName,
  renderPlaceholderText,
  renderValue,
  selectOnlyFacetValue,
  selectedFacetRange,
  selectedFacetValues,
  toggleFacetValue,
}: Props) => {
  if (getIsRangeFacet(name)) {
    return (
      <FacetPickerRange
        changeFacetRange={changeFacetRange}
        getFacetValuesRequest={getFacetValuesRequest}
        lastRefreshedAt={lastRefreshedAt}
        selectedFacetRange={selectedFacetRange}
      />
    );
  }

  return (
    <FacetPickerValues
      excludeFacetValue={excludeFacetValue}
      getFacetValuesRequest={getFacetValuesRequest}
      lastRefreshedAt={lastRefreshedAt}
      name={name}
      renderedName={renderedName}
      renderPlaceholderText={renderPlaceholderText}
      renderValue={renderValue}
      selectOnlyFacetValue={selectOnlyFacetValue}
      selectedFacetValues={selectedFacetValues}
      toggleFacetValue={toggleFacetValue}
    />
  );
};

export default FacetPickerExpanded;
