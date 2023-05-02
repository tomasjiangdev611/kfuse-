import { Input, Loader } from 'components';
import { useRequest, useToggle } from 'hooks';
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import FacetPickerValuesItem from './FacetPickerValuesItem';
import FacetPickerValuesShowAllButton from './FacetPickerValuesShowAllButton';
import { SelectedFacetValues, ValueCount } from 'types';

const numberOfFacetValuesToShow = 20;

const searchFacetValues = (
  facetValues: ValueCount[],
  facetValueSearch: string,
) => {
  const searchLowered = facetValueSearch.trim().toLowerCase();
  if (!searchLowered) {
    return facetValues.sort((a, b) => a.value.localeCompare(b.value));
  }

  return facetValues
    .filter(
      (facetValue) =>
        facetValue.value.toLowerCase().indexOf(searchLowered) > -1,
    )
    .sort((a, b) => a.value.localeCompare(b.value));
};

type Props = {
  disableSearch?: boolean;
  excludeFacetValue: (value: string) => void;
  getFacetValuesRequest: ReturnType<typeof useRequest>;
  lastRefreshedAt: number;
  name: string;
  renderedName: string;
  renderPlaceholderText: (name: string) => string;
  renderValue?: (label: string) => ReactNode;
  selectedFacetValues: SelectedFacetValues;
  selectOnlyFacetValue: (value: string) => void;
  toggleFacetValue: (value: string) => void;
};

const FacetPickerValues = ({
  disableSearch,
  excludeFacetValue,
  getFacetValuesRequest,
  lastRefreshedAt,
  name,
  renderedName,
  renderPlaceholderText,
  renderValue,
  selectedFacetValues,
  selectOnlyFacetValue,
  toggleFacetValue,
}: Props): ReactElement => {
  const [initialFacetValues, setInitialFacetValues] = useState<ValueCount[]>(
    [],
  );
  const [facetValueSearch, setFacetValueSearch] = useState<string>('');
  const showAllToggle = useToggle();

  const isLoading = getFacetValuesRequest.isLoading;
  const facetValues = getFacetValuesRequest.result || [];

  const searchedFacetValues = searchFacetValues(
    initialFacetValues,
    facetValueSearch,
  );

  useEffect(() => {
    getFacetValuesRequest.call().then((facetValues: ValueCount[]) => {
      if (initialFacetValues.length < facetValues.length) {
        setInitialFacetValues(facetValues);
      }
    });
  }, [lastRefreshedAt]);

  const countsByFacetValue: { [value: string]: number } = useMemo(
    () =>
      facetValues.reduce(
        (obj, facetValue: ValueCount) => ({
          ...obj,
          [facetValue.value]: facetValue.count,
        }),
        {},
      ),
    [facetValues],
  );

  const handlersByValue = (value: string) => ({
    excludeFacetValue: () => {
      excludeFacetValue(value);
    },
    selectOnlyFacetValue: () => {
      selectOnlyFacetValue(value);
    },
    toggleFacetValue: () => {
      toggleFacetValue(value);
    },
  });

  const searchedFacetValuesCount = searchedFacetValues.length;

  return (
    <div>
      {!disableSearch && facetValues.length > 6 ? (
        <div className="facet-picker__values">
          <Input
            className="facet-picker__values__input"
            onChange={setFacetValueSearch}
            placeholder={`Filter ${renderedName}`}
            type="text"
            value={facetValueSearch}
          />
        </div>
      ) : null}
      <Loader className="facet-picker__values" isLoading={isLoading}>
        <>
          {!isLoading && searchedFacetValuesCount === 0 ? (
            <div className="facet-picker__values__placeholder">
              {renderPlaceholderText
                ? renderPlaceholderText(name)
                : `No facet values for ${renderedName}`}
            </div>
          ) : (
            searchedFacetValues
              .slice(
                0,
                showAllToggle.value
                  ? searchedFacetValues.length
                  : numberOfFacetValuesToShow,
              )
              .map((facetValue) => {
                return (
                  <FacetPickerValuesItem
                    key={facetValue.value}
                    count={countsByFacetValue[facetValue.value]}
                    renderValue={renderValue}
                    selectedFacetValues={selectedFacetValues}
                    value={facetValue.value}
                    {...handlersByValue(facetValue.value)}
                  />
                );
              })
          )}
          {searchedFacetValuesCount > numberOfFacetValuesToShow ? (
            <FacetPickerValuesShowAllButton
              searchedFacetValuesCount={searchedFacetValuesCount}
              showAllToggle={showAllToggle}
            />
          ) : null}
        </>
      </Loader>
    </div>
  );
};

export default FacetPickerValues;
