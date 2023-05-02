import { AutocompleteOption } from 'components';
import delimiter from 'constants/delimiter';
import { useRequest, useToggle } from 'hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getLabelValues, getLabelNames } from 'requests';
import { isSourceLabel, getLogsOperatorInQuery, parseSearchQuery } from 'utils';
import { RequestResult } from 'types';

import { useLogsState } from '../hooks';
import {
  AutocompleteOptionStateProps,
  RenderPanelProps,
  SearchItemProps,
} from './types';
import {
  isFacetnameExist,
  getSelectedFacetValueTags,
  getFacetNamesOptions,
  getFacetValuesOptions,
  getFilterByFacetTags,
  getFingerprintTags,
  getKeyExistsTags,
  getSearchTags,
  parseSearchTerm,
  isValueExist,
} from './utils';
import { LabelsProps } from '../types';

const mergeLabels = (labelsObject: LabelsProps) => {
  if (labelsObject) {
    const { additional, cloud, core, kubernetes } = labelsObject;
    return [...core, ...cloud, ...kubernetes, ...(additional || [])];
  }
  return [];
};

const sortFacetnames = (facetNames: any) => {
  const facetNamesOptions = getFacetNamesOptions(facetNames, 'facet');
  const sortedFacetNamesOptions = facetNamesOptions.sort((a, b) =>
    a.label > b.label ? 1 : -1,
  );

  return sortedFacetNamesOptions;
};

const useLogsSearchBar = (
  getFacetNamesRequest: RequestResult,
  logsState: ReturnType<typeof useLogsState>,
) => {
  const {
    addFilterByFacet,
    addSearchTerm,
    clearFilterOrExcludeByFingerprint,
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    labels,
    removeFilterByFacetByIndex,
    removeSearchTermByIndex,
    resetFacet,
    searchTerms,
    toggleFacetValue,
    toggleKeyExists,
  } = logsState;

  const markForDeletionToggle = useToggle();
  const focusToggle = useToggle();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState(null);

  const [editFacet, setEditFacet] = useState(null);
  const [editSearch, setEditSearch] = useState(null);
  const [search, setSearch] = useState('');
  const [autoCompleteOption, setAutoCompleteOption] =
    useState<AutocompleteOptionStateProps>({
      facetNames: [],
      facetValues: {},
    });
  const [searchItems, setSearchItems] = useState<SearchItemProps>({
    facetName: '',
    operator: '=',
    optionType: 'label',
    value: '',
  });

  const getLabelNamesRequest = useRequest(getLabelNames);
  const labelValueRequest = useRequest(getLabelValues);

  const labelOptions = useMemo(
    () => getFacetNamesOptions(mergeLabels(labels), 'label'),
    [labels],
  );

  const facetNamesOptions = useMemo(
    () => sortFacetnames(getFacetNamesRequest.result || []),
    [getFacetNamesRequest.result],
  );

  const fetchLabelValues = (
    facetName: string,
    operatorSign: string,
    removeSearch?: boolean,
  ): void => {
    const { date } = logsState;
    if (autoCompleteOption.facetValues[facetName]) {
      renderPanel({
        nextTyped: '',
        options: autoCompleteOption.facetValues[facetName],
        optionType: 'value',
        operatorSign,
        searchInputValue: removeSearch ? '' : search,
      });
      return;
    }

    labelValueRequest
      .call({
        date,
        facetName: facetName.split(':')[1],
        filterOrExcludeByFingerprint: {},
        selectedFacetValues: {},
      })
      .then((facetValues: any) => {
        const facetValuesOptions = getFacetValuesOptions(facetValues);
        renderPanel({
          nextTyped: '',
          options: facetValuesOptions,
          optionType: 'value',
          operatorSign,
          searchInputValue: removeSearch ? '' : search,
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

  const onBackspace = () => {
    if (search === '') {
      clearSearchItem();
      if (tags.length) {
        if (markForDeletionToggle.value) {
          tags[tags.length - 1].onClick();
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

    const parsedOperator = getLogsOperatorInQuery(nextSearch);
    if (parsedOperator) {
      setSearchItems((prev) => ({ ...prev, operator: parsedOperator }));
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
      closePanel();
    }

    if (nextSearch && markForDeletionToggle.value) {
      markForDeletionToggle.off();
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

  const onApplyFilter = (query: SearchItemProps) => {
    if (
      (query.operator === '=' || query.operator === '!=') &&
      isSourceLabel(query.facetName)
    ) {
      const { facetName, value, operator } = query;
      const facetKey = facetName.split(':').join(delimiter);
      const facetValue = `${facetKey}${delimiter}${value}`;
      selectedFacetValues[facetValue] = operator === '=' ? 1 : 0;
      toggleFacetValue({
        facetKey,
        nextSelectionByFacetKeys: selectedFacetValues,
      });
    } else {
      if (editFacet !== null) {
        removeFilterByFacetByIndex(editFacet);
        setEditFacet(null);
      }
      addFilterByFacet(query);
    }

    clearSearchItem();
    setSearch('');
    setTimeout(() => inputRef.current?.blur(), 150);
  };

  const onEnter = () => {
    closePanel();
    setSearchItems((prevState) => {
      const { facetName, operator, value } = prevState;
      if (facetName && operator && value) {
        onApplyFilter({ facetName, operator, value });
        return prevState;
      }

      // if it is a valid query then filter
      const parsedQuery = parseSearchQuery(search);
      if (parsedQuery) {
        onApplyFilter(parsedQuery);
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
      closePanel();
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

  const renderPanel = (renderData: RenderPanelProps) => {
    const panelWidth = inputRef.current?.getBoundingClientRect().width || 400;
    const { nextTyped, options, optionType, operatorSign, searchInputValue } =
      renderData;

    setActivePanel(() => {
      return {
        operatorSign,
        options,
        optionType,
        panelWidth,
        searchOption: {
          label: searchInputValue ? searchInputValue : '',
          value: searchInputValue ? searchInputValue : '',
          optionType: 'search',
        },
        typed: nextTyped,
        value: searchInputValue,
      };
    });
  };

  const clearSearchItem = () => {
    setSearchItems({
      facetName: '',
      operator: '=',
      value: '',
    });
    setEditSearch(null);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  const onEditFilterByFacet = (filter: string, index: number) => {
    const splitOperator = getLogsOperatorInQuery(filter);
    const splitQuery = filter.split(splitOperator);
    setSearchItems({
      facetName: splitQuery[0],
      operator: splitOperator,
      value: splitQuery[1],
    });
    setSearch(filter);
    setEditFacet(index);
  };

  const onEditGrepSearch = (op: string, val: string, idx: number) => {
    setSearch(`${val}`);
    setSearchItems((prev) => ({ ...prev, operator: op }));
    setEditSearch(idx);
    setTimeout(() => inputRef.current.focus(), 100);
  };

  const openDefinedFacetPanel = () => {
    setSearchItems((prevState) => {
      return {
        ...prevState,
        facetName: 'Core:source',
        operator: '=',
        value: '',
      };
    });
    fetchLabelValues('Core:source', '=', true);
    setSearch('Core:source="');
  };

  const onSearchAsString = (nextSearch: string) => {
    const trimmedSearch = nextSearch.trim();
    if (trimmedSearch) {
      const { operator, search } = parseSearchTerm(
        trimmedSearch,
        searchItems.operator,
      );
      if (editSearch !== null) {
        removeSearchTermByIndex(editSearch);
        setEditSearch(null);
      }
      addSearchTerm(`${operator}:${search}`);
    }
    setSearch('');
  };

  useEffect(() => {
    setAutoCompleteOption((prevState) => {
      return {
        ...prevState,
        facetNames: [...labelOptions, ...facetNamesOptions],
      };
    });
  }, [labelOptions, facetNamesOptions]);

  const tags = [
    ...getSelectedFacetValueTags(
      selectedFacetValues,
      editFacet,
      resetFacet,
      setEditFacet,
    ),
    ...getFingerprintTags(
      filterOrExcludeByFingerprint,
      clearFilterOrExcludeByFingerprint,
    ),
    ...getSearchTags(removeSearchTermByIndex, searchTerms, onEditGrepSearch),
    ...getKeyExistsTags(keyExists, toggleKeyExists),
    ...getFilterByFacetTags(
      filterByFacets,
      removeFilterByFacetByIndex,
      onEditFilterByFacet,
    ),
  ];

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setActivePanel(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return {
    activePanel,
    focusToggle,
    editFacet,
    getLabelNamesRequest,
    inputRef,
    markForDeletionToggle,
    onAutocompleteOptionClick,
    onBackspace,
    onChange,
    onClick,
    onEnter,
    onFoucs,
    openDefinedFacetPanel,
    renderPanel,
    search,
    setEditFacet,
    setSearch,
    setSearchItems,
    setActivePanel,
    tags,
  };
};

export default useLogsSearchBar;
