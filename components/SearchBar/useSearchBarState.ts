import { AutocompleteOption, usePopoverContext } from 'components';
import { useRequest, useToggle } from 'hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getFacetNames, getLabelValues } from 'requests';
import { DateSelection } from 'types/DateSelection';
import {
  AddSearchFilterProps,
  AutocompleteOptionStateProps,
  LabelsProps,
  RenderAutocompletePanelProps,
  SearchItemProps,
} from 'types/SearchBar';

import {
  isFacetnameExist,
  isSourceLabel,
  isValueExist,
  getFacetNamesOptions,
  getFacetValuesOptions,
  parseFilterByFacetQuery,
  getOperatorInQuery,
  mergeLabels,
  sortAutocompleteOptions,
} from 'utils';

import SearchBarPanel from './SearchBarPanel';

const useSearchBarState = ({
  addSearchFilters,
  date,
  labels,
}: {
  addSearchFilters: AddSearchFilterProps;
  date: DateSelection;
  labels: LabelsProps;
}) => {
  const { addFilterByFacet, addSearchTerm } = addSearchFilters;
  const popover = usePopoverContext();
  const markForDeletionToggle = useToggle();
  const focusToggle = useToggle();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');

  const [searchItems, setSearchItems] = useState<SearchItemProps>({
    facetName: '',
    operator: '=',
    value: '',
    optionType: 'label',
  });
  const [autoCompleteOption, setAutoCompleteOption] =
    useState<AutocompleteOptionStateProps>({
      facetNames: [],
      facetValues: {},
    });

  const facetNameRequest = useRequest(getFacetNames);
  const labelValueRequest = useRequest(getLabelValues);

  const labelOptions = useMemo(
    () => getFacetNamesOptions(mergeLabels(labels), 'label'),
    [labels],
  );
  const facetNamesOptions = useMemo(
    () => sortAutocompleteOptions(facetNameRequest.result || []),
    [facetNameRequest.result],
  );
  const fetchLabelValues = (facetName: string, operatorSign: string): void => {
    if (autoCompleteOption.facetValues[facetName]) {
      renderPanel({
        nextTyped: '',
        options: autoCompleteOption.facetValues[facetName],
        optionType: 'value',
        operatorSign,
        searchInputValue: search,
      });
      return;
    }

    labelValueRequest
      .call({ date, facetName: facetName.split(':')[1] })
      .then((facetValues: any) => {
        const facetValuesOptions = getFacetValuesOptions(facetValues);
        renderPanel({
          nextTyped: '',
          options: facetValuesOptions,
          optionType: 'value',
          operatorSign,
          searchInputValue: search,
        });
        setAutoCompleteOption({
          ...autoCompleteOption,
          facetValues: {
            ...autoCompleteOption.facetValues,
            [facetName]: facetValuesOptions,
          },
        });
      });
  };

  const onFoucs = () => {
    if (!search) {
      renderPanel({
        nextTyped: '',
        options: autoCompleteOption.facetNames,
        optionType: 'facet',
        operatorSign: searchItems.operator,
        searchInputValue: search,
      });
    } else {
      onChange(search);
    }

    focusToggle.on();
  };

  const checkSearchOrder = (nextSearch: string): any => {
    const { facetNames, facetValues } = autoCompleteOption;
    const { facetName, value } = searchItems;

    if (!facetName) {
      return facetNames;
    }
    if (!isFacetnameExist(nextSearch, facetName)) {
      setSearchItems((prev) => ({ ...prev, facetName: '' }));
      return facetNames;
    }

    if (!isValueExist(nextSearch, value)) {
      setSearchItems((prev) => ({ ...prev, value: '' }));
    }

    if (facetName && isSourceLabel(facetName)) {
      return facetValues[facetName];
    }

    return [];
  };

  const onChange = (nextSearch: string) => {
    setSearch(nextSearch);
    const checkSearch = checkSearchOrder(nextSearch);
    if (checkSearch) {
      let typed = '';
      if (searchItems.facetName && searchItems.operator) {
        const splitSearchTerm = nextSearch.split(searchItems.operator);
        typed = splitSearchTerm[splitSearchTerm.length - 1];
        typed = typed.slice(1, typed.length - 1);
      } else {
        typed = nextSearch;
      }

      renderPanel({
        nextTyped: typed,
        options: checkSearch,
        optionType:
          checkSearch.length > 1 ? checkSearch[1].optionType : 'facet',
        operatorSign: searchItems.operator,
        searchInputValue: nextSearch,
      });
    } else if (checkSearch === null) {
      popover.close();
    }

    if (nextSearch && markForDeletionToggle.value) {
      markForDeletionToggle.off();
    }
  };

  const onEnter = () => {
    popover.close();
    setSearchItems((prevState) => {
      const { facetName, operator, value } = prevState;
      const { facetNames } = autoCompleteOption;
      if (facetName && operator && value) {
        addFilterByFacet({ facetName, operator, value });
        clearSearchItem();
        setSearch('');
        setTimeout(() => inputRef.current?.blur(), 150);
        return prevState;
      }

      // if it is a valid query then filter
      const parsedQuery = parseFilterByFacetQuery(search, facetNames);
      if (parsedQuery) {
        addFilterByFacet(parsedQuery);
        clearSearchItem();
        setSearch('');
        inputRef.current?.blur();
        return prevState;
      }

      // if facetName exist and value is null and its label
      if (facetName && !value && isSourceLabel(facetName)) {
        fetchLabelValues(facetName, operator);
        return prevState;
      }

      // if facetName exist in the string and query is invalid
      if (facetName && isFacetnameExist(search, facetName)) {
        return prevState;
      }

      // if none of above then do grep search
      if (search) {
        onSearchAsString(search);
        clearSearchItem();
        return prevState;
      }

      return prevState;
    });
  };

  const clearSearchItem = () => {
    setSearchItems({
      facetName: '',
      operator: '=',
      value: '',
    });
  };

  const onSearchAsString = (nextSearch: string) => {
    const trimmedSearch = nextSearch.trim();
    if (trimmedSearch) {
      addSearchTerm(trimmedSearch);
      setSearch('');
    }
  };

  const onAutocompleteOptionClick = (
    close: () => void,
    option: AutocompleteOption,
    type: 'mouse' | 'key',
  ) => {
    const { value: optionValue, optionType } = option;
    if (optionType === 'search') {
      setSearchItems((prevState) => ({ ...prevState, optionType }));
      onSearchAsString(optionValue);
      clearSearchItem();
      popover.close();
    } else {
      setSearchItems((prevSearchItem) => {
        const newSearchItem = { ...prevSearchItem };
        if (prevSearchItem.facetName) {
          newSearchItem.value = optionValue;
        } else {
          newSearchItem.facetName = optionValue;
          setTimeout(() => inputRef.current.focus(), 100);
        }
        newSearchItem.optionType = optionType;

        const { facetName, operator, value } = newSearchItem;
        const searchTerm = `${facetName}${operator}${
          value ? `"${value}"` : '"'
        }`;
        setSearch(searchTerm);

        return newSearchItem;
      });
      if (type === 'mouse' && optionType !== 'facet') {
        onEnter();
      }
    }
  };

  const renderPanel = (renderData: RenderAutocompletePanelProps) => {
    const panelWidth = inputRef.current?.getBoundingClientRect().width || 400;
    const { nextTyped, options, optionType, operatorSign, searchInputValue } =
      renderData;

    popover.open({
      component: SearchBarPanel,
      props: {
        deselectable: false,
        fullTextSearch: true,
        onClickHandler: onAutocompleteOptionClick,
        operatorSign,
        options,
        optionType,
        searchOption: {
          label: searchInputValue ? searchInputValue : '',
          value: searchInputValue ? searchInputValue : '',
          optionType: 'search',
        },
        setSearchItems,
        setSearch,
        typed: nextTyped,
        value: searchInputValue,
      },
      element: inputRef.current,
      onClose: popover.close,
      popoverPanelClassName: 'popover__panel--autocomplete',
      width: panelWidth,
    });
  };

  const onEditFilterByFacet = (filter: string) => {
    const splitOperator = getOperatorInQuery(filter);
    const splitQuery = filter.split(splitOperator);
    setSearchItems({
      facetName: splitQuery[0],
      operator: splitOperator,
      value: splitQuery[1],
    });
    setSearch(filter);
  };

  const openDefinedFacetPanel = (facet: string, operator: string) => {
    setSearchItems((prevState) => {
      return {
        ...prevState,
        facetName: facet,
        operator: operator,
        value: '',
      };
    });
    fetchLabelValues(facet, operator);
    setSearch(`${facet}${operator}"`);
  };

  useEffect(() => {
    setAutoCompleteOption((prevState) => {
      return {
        ...prevState,
        facetNames: [...labelOptions, ...facetNamesOptions],
      };
    });
  }, [labelOptions, facetNamesOptions]);

  return {
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
  };
};

export default useSearchBarState;
