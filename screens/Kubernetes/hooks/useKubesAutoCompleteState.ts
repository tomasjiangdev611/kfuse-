import { AutocompleteOption, usePopoverContext } from 'components';
import { useRequest, useToggle } from 'hooks';
import { useMemo, useRef, useState } from 'react';
import { eventFacetValues } from 'requests';
import { EventsSearchBarPanel } from 'screens/Events/components';
import { EventSearchItemProps } from 'screens/Events/types';
import {
  getFacetValuesTags,
  getFilterByFacetTags,
  getLabelsOptions,
  getSearchTermsTags,
  getValuesOptions,
} from 'screens/Events/utils';
import { parseFilterByFacetQuery, isFacetnameExist, isValueExist } from 'utils';
import useKubesState from './useKubesState';

const useKubesAutocompleteState = (
  kubesState: ReturnType<typeof useKubesState>,
) => {
  const {
    additionalValues,
    additionalLabels,
    filterByFacets,
    removeSearchTermByIndex,
    searchTerms,
    selectedFacetValuesByNameState,
    setFilterByFacets,
    setSearchTerms,
  } = kubesState;
  const popover = usePopoverContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const focusToggle = useToggle();
  const updatedValuesArr: any[] = [];
  const [searchItems, setSearchItems] = useState<EventSearchItemProps>({
    facet: '',
    value: '',
    operator: '=',
    optionType: 'facet',
  });
  const [facetValues, setFacetValues] = useState<{
    [key: string]: AutocompleteOption[];
  }>({});

  const facetValuesRequest = useRequest(eventFacetValues);

  const autocompleteOptions = useMemo(
    () => [...getLabelsOptions([...additionalLabels])],
    [additionalLabels],
  );

  const fetchValues = (facet: string, request: any) => {
    if (!facetValues[facet]) {
      const valuesList = additionalValues.map(
        ({ facetValue: value, ...rest }) => ({
          value,
          ...rest,
        }),
      );
      valuesList.map((item) => {
        if (item.facetKey === facet) {
          updatedValuesArr.push(item);
        }
      });

      const valuesOptions = getValuesOptions(updatedValuesArr);
      renderPanel({
        nextTyped: '',
        options: valuesOptions,
        optionType: 'value',
        searchInputValue: search,
      });
      setFacetValues((prevState) => {
        return {
          ...prevState,
          [facet]: valuesOptions,
        };
      });
    } else {
      renderPanel({
        nextTyped: '',
        options: facetValues[facet],
        optionType: 'value',
        searchInputValue: search,
      });
    }
  };

  const onBackspace = () => {
    if (search === '') {
      setSearchItems({
        facet: '',
        value: '',
        operator: '=',
        optionType: 'facet',
      });
      renderPanel({
        nextTyped: '',
        options: autocompleteOptions,
        optionType: 'facet',
        searchInputValue: search,
      });
    }
  };

  const clearSearchItem = () => {
    setSearchItems({
      facet: '',
      operator: '=',
      value: '',
      optionType: 'facet',
    });
  };

  const onEnter = () => {
    popover.close();
    setSearchItems((prevState) => {
      const { facet, operator, optionType, value } = prevState;

      if (facet && value) {
        setFilterByFacets((prevState) => {
          return { ...prevState, [`${facet}${operator}${value}`]: true };
        });
        setSearch('');
        clearSearchItem();
        return;
      }

      // if it is a valid query then filter
      const parsedQuery = parseFilterByFacetQuery(search, autocompleteOptions);
      if (parsedQuery) {
        setFilterByFacets((prevState) => {
          return {
            ...prevState,
            [`${parsedQuery.facetName}${parsedQuery.operator}${parsedQuery.value}`]:
              true,
          };
        });
        clearSearchItem();
        setSearch('');
        inputRef.current?.blur();
        return prevState;
      }

      // if facet exist and value is null
      if (facet && !value) {
        if (optionType === 'facet') {
          fetchValues(facet, facetValuesRequest);
        } else {
          fetchValues(facet, additionalValues);
        }
        return prevState;
      }

      // if none of above then do grep search
      if (search) {
        setSearchTerms((prevState) => [...prevState, search]);
        setSearch('');
        clearSearchItem();
        return prevState;
      }

      return prevState;
    });
  };

  const removeFilter = (facet: string) => {
    setFilterByFacets((prevState) => {
      const newState = { ...prevState };
      delete newState[facet];
      return newState;
    });
  };

  const onAutocompleteOptionClick = (
    close: () => void,
    option: AutocompleteOption,
    type: 'mouse' | 'key',
  ) => {
    const { value: optionValue, optionType } = option;
    if (optionType === 'search') {
      setSearchTerms((prevState) => [...prevState, optionValue]);
      clearSearchItem();
      setSearch('');
      popover.close();
    } else {
      setSearchItems((prevSearchItem) => {
        const newSearchItem = { ...prevSearchItem };

        if (prevSearchItem.facet) {
          newSearchItem.value = optionValue;
        } else {
          newSearchItem.facet = optionValue;
          setTimeout(() => inputRef.current.focus(), 100);
        }
        newSearchItem.optionType = optionType;

        const { facet, operator, value } = newSearchItem;
        const searchTerm = `${facet}${operator}${value ? `"${value}"` : '"'}`;
        setSearch(searchTerm);

        return newSearchItem;
      });
      if (type === 'mouse' || type === 'key') {
        onEnter();
      }
    }
  };

  const renderPanel = ({
    nextTyped,
    options,
    optionType,
    searchInputValue,
  }: {
    nextTyped: string;
    options: AutocompleteOption[];
    optionType: string;
    searchInputValue?: string;
  }) => {
    const panelWidth = inputRef.current?.getBoundingClientRect().width || 400;
    popover.open({
      component: EventsSearchBarPanel,
      props: {
        deselectable: false,
        fullTextSearch: true,
        onClickHandler: onAutocompleteOptionClick,
        options,
        optionType,
        searchOption: { label: null, value: null, optionType: 'search' },
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

  const checkSearchOrder = (nextSearch: string): any => {
    const { facet, value } = searchItems;

    if (!facet) {
      return autocompleteOptions;
    }

    if (!isFacetnameExist(nextSearch, facet)) {
      setSearchItems((prev) => ({ ...prev, facet: '' }));
      return autocompleteOptions;
    }

    if (!isValueExist(nextSearch, value)) {
      setSearchItems((prev) => ({ ...prev, value: '' }));
    }

    if (facet && !value) {
      return facetValues[facet];
    }

    return [];
  };

  const onChange = (nextSearch: string) => {
    setSearch(nextSearch);
    const checkSearch = checkSearchOrder(nextSearch);
    if (checkSearch) {
      let typed = '';
      if (searchItems.facet && searchItems.operator) {
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
          checkSearch.length > 0 ? checkSearch[0].optionType : 'facet',
        searchInputValue: nextSearch,
      });
    } else if (checkSearch === null) {
      popover.close();
    }
  };

  const onFoucs = () => {
    if (!search) {
      renderPanel({
        nextTyped: '',
        options: autocompleteOptions,
        optionType: 'facet',
        searchInputValue: search,
      });
    } else {
      onChange(search);
    }
    focusToggle.on();
  };

  const { state, toggleFacetValue } = selectedFacetValuesByNameState;
  const tags = [
    ...getFacetValuesTags(state, toggleFacetValue),
    ...getFilterByFacetTags(filterByFacets, removeFilter),
    ...getSearchTermsTags(searchTerms, removeSearchTermByIndex),
  ];

  return {
    focusToggle,
    inputRef,
    onBackspace,
    onChange,
    onEnter,
    onFoucs,
    search,
    tags,
  };
};

export default useKubesAutocompleteState;
