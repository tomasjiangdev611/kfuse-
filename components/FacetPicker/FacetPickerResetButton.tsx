import classnames from 'classnames';
import { X } from 'react-feather';
import React from 'react';
import { SelectedFacetRange, SelectedFacetValues } from 'types';

type Props = {
  clearFacet: () => void;
  selectedFacetRange: SelectedFacetRange;
  selectedFacetValues: SelectedFacetValues;
};

const FacetPickerResetButton = ({
  clearFacet,
  selectedFacetRange,
  selectedFacetValues,
}: Props) => {
  if (selectedFacetRange) {
    return (
      <div
        className={classnames({
          'facet-picker__title__reset-button': true,
        })}
      >
        <div className="facet-picker__title__reset-button__number">1</div>
        <button
          className="facet-picker__title__reset-button__x"
          onClick={clearFacet}
        >
          <X size={10} />
        </button>
      </div>
    );
  }

  const modifiedKeys = Object.keys(selectedFacetValues);
  const hasBeenModified = modifiedKeys.length;

  if (hasBeenModified) {
    const isExcluding = selectedFacetValues[modifiedKeys[0]] === 0;

    return (
      <div
        className={classnames({
          'facet-picker__title__reset-button': true,
          'facet-picker__title__reset-button--excluding': isExcluding,
        })}
      >
        <div className="facet-picker__title__reset-button__number">
          {modifiedKeys.length}
        </div>
        <button
          className="facet-picker__title__reset-button__x"
          onClick={clearFacet}
        >
          <X size={10} />
        </button>
      </div>
    );
  }

  return null;
};

export default FacetPickerResetButton;
