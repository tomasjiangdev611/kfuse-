import { FlyoutCaret } from 'components';
import { useToggle, useRequest } from 'hooks';
import React, { ReactElement, ReactNode, useRef } from 'react';
import { SelectedFacetValues } from 'types';
import FacetPickerExpanded from './FacetPickerExpanded';
import FacetPickerResetButton from './FacetPickerResetButton';

type Props = {
  changeFacetRange: (value: number) => void;
  clearFacet: () => void;
  excludeFacetValue: (value: string) => void;
  name: string;
  forceExpanded?: boolean;
  lastRefreshedAt: number;
  renderName?: (name: string) => ReactNode;
  renderPlaceholderText?: (name: string) => string;
  renderValue?: (value: string) => ReactNode;
  request: (args: any) => Promise<any>;
  selectedFacetRange: any;
  selectOnlyFacetValue: (value: string) => void;
  selectedFacetValues: SelectedFacetValues;
  toggleFacetValue: (value: string) => void;
};

const FacetPicker = ({
  changeFacetRange,
  clearFacet,
  excludeFacetValue,
  forceExpanded,
  lastRefreshedAt,
  name,
  renderName,
  renderPlaceholderText,
  renderValue,
  request,
  selectOnlyFacetValue,
  selectedFacetRange,
  selectedFacetValues,
  toggleFacetValue,
}: Props): ReactElement => {
  const getFacetValuesRequest = useRequest(request);
  const expandedToggle = useToggle();
  const expanded = forceExpanded || expandedToggle.value;
  const ref = useRef(null);
  const renderedName = renderName ? renderName(name) : name;

  return (
    <>
      <div className="facet-picker" ref={ref}>
        <div className="facet-picker__title">
          {forceExpanded ? (
            <div className="facet-picker__title__button">
              <div className="facet-picker__title__button__text">
                {renderedName}
              </div>
            </div>
          ) : (
            <button
              className="facet-picker__title__button"
              onClick={expandedToggle.toggle}
            >
              <div className="facet-picker__title__button__text">
                {renderedName}
              </div>
              <div className="facet-picker__title__button__flyout-caret">
                <FlyoutCaret isOpen={expanded} />
              </div>
            </button>
          )}
          <div className="facet-picker__title__actions">
            <FacetPickerResetButton
              clearFacet={clearFacet}
              selectedFacetRange={selectedFacetRange}
              selectedFacetValues={selectedFacetValues}
            />
          </div>
        </div>
        {expanded ? (
          <FacetPickerExpanded
            changeFacetRange={changeFacetRange}
            excludeFacetValue={excludeFacetValue}
            getFacetValuesRequest={getFacetValuesRequest}
            lastRefreshedAt={lastRefreshedAt}
            name={name}
            renderedName={renderedName}
            renderPlaceholderText={renderPlaceholderText}
            renderValue={renderValue}
            selectOnlyFacetValue={selectOnlyFacetValue}
            selectedFacetRange={selectedFacetRange}
            selectedFacetValues={selectedFacetValues}
            toggleFacetValue={toggleFacetValue}
          />
        ) : null}
      </div>
    </>
  );
};

export default FacetPicker;
