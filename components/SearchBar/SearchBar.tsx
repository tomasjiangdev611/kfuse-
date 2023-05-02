import { Input } from 'components';
import React, { ReactElement, useEffect } from 'react';
import { DateSelection } from 'types/DateSelection';
import {
  AddSearchFilterProps,
  LabelsProps,
  SearchBarState,
} from 'types/SearchBar';
import { checkSourceExist, getFilterByFacetTags, getSearchTags } from 'utils';

import SearchBarTags from './SearchBarTags';
import useSearchBarState from './useSearchBarState';

const SearchBar = ({
  addSearchFilters,
  date,
  labels,
  searchBarState,
}: {
  addSearchFilters: AddSearchFilterProps;
  date: DateSelection;
  labels: LabelsProps;
  searchBarState: SearchBarState;
}): ReactElement => {
  const {
    autoCompleteOption,
    clearSearchItem,
    inputRef,
    facetNameRequest,
    focusToggle,
    markForDeletionToggle,
    onChange,
    onEditFilterByFacet,
    onEnter,
    onFoucs,
    openDefinedFacetPanel,
    renderPanel,
    search,
    setSearch,
  } = useSearchBarState({ date, labels, addSearchFilters });

  useEffect(() => {
    const callFacetNameRequest = () => {
      facetNameRequest.call({ date });
      inputRef.current.removeEventListener('mouseenter', callFacetNameRequest);
    };
    inputRef.current.addEventListener('mouseenter', callFacetNameRequest);
  }, [date]);

  const {
    filterByFacets,
    removeFilterByFacetByIndex,
    removeSearchTermByIndex,
    searchTerms,
  } = searchBarState;
  const searchTags = [
    ...getSearchTags(removeSearchTermByIndex, searchTerms, setSearch),
    ...getFilterByFacetTags(
      filterByFacets,
      removeFilterByFacetByIndex,
      onEditFilterByFacet,
    ),
  ];

  const onBackspace = () => {
    if (search === '') {
      clearSearchItem();
      if (searchTags.length) {
        if (markForDeletionToggle.value) {
          searchTags[searchTags.length - 1].onClick();
          markForDeletionToggle.off();
        } else {
          markForDeletionToggle.on();
        }
      } else {
        if (markForDeletionToggle.value) {
          markForDeletionToggle.off();
        }
      }
      renderPanel({
        nextTyped: '',
        options: autoCompleteOption.facetNames,
        optionType: 'facet',
        operatorSign: '=',
        searchInputValue: search,
      });
    }
  };

  const onClick = () => {
    if (!focusToggle.value) {
      const input = inputRef.current;
      if (input) {
        input.focus();
      }
    }
  };

  const isSourceExist = checkSourceExist({}, filterByFacets);

  return (
    <div className="field-group logs__search__input">
      <div className="field-group__item field-group__item--flex">
        <div className="logs__search-bar" onClick={onClick}>
          <SearchBarTags
            isSourceExist={isSourceExist}
            markForDeletionToggle={markForDeletionToggle}
            tags={searchTags}
          />
          <Input
            className="logs__search-bar__input"
            onBackspace={onBackspace}
            onBlur={focusToggle.off}
            onChange={onChange}
            onEnter={onEnter}
            onFocus={onFoucs}
            ref={inputRef}
            placeholder="Search Logs filters"
            type="text"
            value={search}
          />
        </div>
        {!isSourceExist && searchTerms.length > 0 ? (
          <div className="text--red logs__search-bar--error-text">
            Please select a source to search, adding source will speed up your
            search.
            <a onClick={() => openDefinedFacetPanel('Core:source', '=')}>
              Get source list
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
