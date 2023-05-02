import { delimiter } from 'constants';
import dayjs from 'dayjs';
import { useReducer } from 'react';
import {
  Action,
  ActionType,
  DateSelection,
  LogEvent,
  LogsState,
  LogsWorkbook,
  LogsWorkbooksState,
} from 'types';
import clearSelectedFacetValuesByFacetKey from './clearSelectedFacetValuesByFacetKey';
import readLogsStateFromUrlParams from './readLogsStateFromUrlParams';
import writeLogsStateToUrlParams from './writeLogsStateToUrlParams';
import { SearchItemProps } from '../../LogsSearchBar/types';
import { FacetBase } from '../../types';

const endTimeUnix = dayjs().unix();
const startTimeUnix = dayjs()
  .subtract(60 * 5, 'seconds')
  .unix();

const getNewLogsState = (): LogsState => ({
  date: {
    startLabel: 'now-5m',
    endLabel: 'now',
    endTimeUnix,
    startTimeUnix,
  },
  keyExists: {},
  filterByFacets: [],
  filterOrExcludeByFingerprint: {},
  searchTerms: [],
  selectedFacetValues: {},
});

const getNewLogsWorkbook = (): LogsWorkbook => ({
  name: '',
  logsState: getNewLogsState(),
  history: [],
  createdAt: new Date(),
});

const getInitialLogsWorkbook = (): LogsWorkbook => ({
  name: '',
  logsState: readLogsStateFromUrlParams(),
  history: [],
  createdAt: new Date(),
});

const getInitialLogsWorkbooksState = (): LogsWorkbooksState => ({
  currentWorkbookIndex: 0,
  isReady: false,
  workbooks: [getInitialLogsWorkbook()],
});

const addFilterByFacet = (
  filterByFacets: LogsState['filterByFacets'],
  payload: SearchItemProps,
): LogsState['filterByFacets'] => {
  const { facetName, value, operator } = payload;
  const newFilterByFacets = [...filterByFacets];
  newFilterByFacets.push(`${facetName}${operator}"${value}"`);
  return newFilterByFacets;
};

const addSearchTerm = (
  prevSearchTerms: LogsState['searchTerms'],
  searchTerm: string,
): LogsState['searchTerms'] => {
  const nextSearchTerms = [...prevSearchTerms, searchTerm];
  return nextSearchTerms;
};

const applyDeselectedFacetValues = (
  prevDeselectedFacetValues: LogsState['selectedFacetValues'],
  {
    component,
    facetName,
    facetValuesToSelect,
  }: {
    component: string;
    facetName: string;
    facetValuesToSelect: { [key: string]: number };
  },
): LogsState['selectedFacetValues'] => {
  const facetKey = `${component}${delimiter}${facetName}`;
  const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
    facetKey,
    prevDeselectedFacetValues,
  );

  return {
    ...nextSelectedFacetValues,
    ...facetValuesToSelect,
  };
};

const clearFilterOrExcludeByFingerprint = (
  prevFilterOrExcludeByFingerprint: LogsState['filterOrExcludeByFingerprint'],
  fpHash: string,
): LogsState['filterOrExcludeByFingerprint'] => {
  const nextFilterOrExcludeByFingerprint = {
    ...prevFilterOrExcludeByFingerprint,
  };
  delete nextFilterOrExcludeByFingerprint[fpHash];
  return nextFilterOrExcludeByFingerprint;
};

const excludeFingerprint = (
  prevFilterOrExcludeByFingerprint: LogsState['filterOrExcludeByFingerprint'],
  fpHash: string,
): LogsState['filterOrExcludeByFingerprint'] => {
  const nextFilterOrExcludeByFingerprint = {
    ...prevFilterOrExcludeByFingerprint,
  };
  nextFilterOrExcludeByFingerprint[fpHash] = false;
  return nextFilterOrExcludeByFingerprint;
};

const filterFingerpint = (
  prevFilterOrExcludeByFingerprint: LogsState['filterOrExcludeByFingerprint'],
  fpHash: string,
): LogsState['filterOrExcludeByFingerprint'] => {
  const nextFilterOrExcludeByFingerprint = {
    ...prevFilterOrExcludeByFingerprint,
  };
  nextFilterOrExcludeByFingerprint[fpHash] = true;

  return nextFilterOrExcludeByFingerprint;
};

const filterOnlyFacetValueFromLogEventDetail = (
  prevDeselectedFacetValues: LogsState['selectedFacetValues'],
  {
    name,
    source,
    value,
    exclude = false,
  }: {
    name: string;
    source: string;
    value: string;
    exclude: boolean;
  },
): LogsState['selectedFacetValues'] => {
  const facetKey = `${source}${delimiter}${name}`;
  const facetValueCompositeKey = `${facetKey}${delimiter}${value}`;
  const nextSelectedFacetValues: { [key: string]: number } =
    clearSelectedFacetValuesByFacetKey(facetKey, prevDeselectedFacetValues);
  nextSelectedFacetValues[facetValueCompositeKey] = exclude ? 0 : 1;
  return nextSelectedFacetValues;
};

const removeFilterByFacetByIndex = (
  filterByFacets: LogsState['filterByFacets'],
  index: number,
): LogsState['filterByFacets'] => {
  const newFilterByFacets = [...filterByFacets];
  newFilterByFacets.splice(index, 1);
  return newFilterByFacets;
};

const removeSearchTermByIndex = (
  prevSearchTerms: LogsState['searchTerms'],
  i: number,
): LogsState['searchTerms'] => {
  const nextSearchTerms = [...prevSearchTerms];
  nextSearchTerms.splice(i, 1);

  return nextSearchTerms;
};

const resetFacet = (
  prevSelectedFacetValues: LogsState['selectedFacetValues'],
  { component, name }: FacetBase,
): LogsState['selectedFacetValues'] => {
  const facetKey = `${component}${delimiter}${name}`;

  const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
    facetKey,
    prevSelectedFacetValues,
  );

  return nextSelectedFacetValues;
};

const toggleFacetValue = (
  prevDeselectedFacetValues: LogsState['selectedFacetValues'],
  {
    facetKey,
    nextSelectionByFacetKeys,
  }: {
    facetKey: string;
    nextSelectionByFacetKeys: { [key: string]: number };
  },
) => {
  const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
    facetKey,
    prevDeselectedFacetValues,
  );

  return {
    ...nextSelectedFacetValues,
    ...nextSelectionByFacetKeys,
  };
};

const toggleKeyExists = (
  prevKeyExists: LogsState['keyExists'],
  { component, name, type }: FacetBase,
): LogsState['keyExists'] => {
  const facetKeyWithType = `${component}${delimiter}${name}${delimiter}${type}`;
  const nextKeyExists = {
    ...prevKeyExists,
    [facetKeyWithType]: prevKeyExists[facetKeyWithType] ? 0 : 1,
  };

  return nextKeyExists;
};

const logsStateReducer = (state: LogsState, action: Action): LogsState => {
  switch (action.type) {
    case ActionType.ADD_FILTER_BY_FACET:
      return {
        ...state,
        filterByFacets: addFilterByFacet(state.filterByFacets, action.payload),
      };

    case ActionType.ADD_SEARCH_TERM:
      return {
        ...state,
        searchTerms: addSearchTerm(state.searchTerms, action.payload),
      };

    case ActionType.APPLY_DESELECTED_FACET_VALUES:
      return {
        ...state,
        selectedFacetValues: applyDeselectedFacetValues(
          state.selectedFacetValues,
          action.payload,
        ),
      };

    case ActionType.CLEAR:
      return {
        ...getNewLogsState(),
        date: state.date,
      };

    case ActionType.CLEAR_FILTER_OR_EXCLUDE_BY_FINGERPRINT:
      return {
        ...state,
        filterOrExcludeByFingerprint: clearFilterOrExcludeByFingerprint(
          state.filterOrExcludeByFingerprint,
          action.payload,
        ),
      };

    case ActionType.EXCLUDE_FINGERPRINT:
      return {
        ...state,
        filterOrExcludeByFingerprint: excludeFingerprint(
          state.filterOrExcludeByFingerprint,
          action.payload,
        ),
      };

    case ActionType.FILTER_FINGERPRINT:
      return {
        ...state,
        filterOrExcludeByFingerprint: filterFingerpint(
          state.filterOrExcludeByFingerprint,
          action.payload,
        ),
      };

    case ActionType.FILTER_ONLY_FACET_VALUE_FROM_LOG_EVENT_DETAIL:
      return {
        ...state,
        selectedFacetValues: filterOnlyFacetValueFromLogEventDetail(
          state.selectedFacetValues,
          action.payload,
        ),
      };

    case ActionType.REMOVE_FILTER_BY_FACET_BY_INDEX:
      return {
        ...state,
        filterByFacets: removeFilterByFacetByIndex(
          state.filterByFacets,
          action.payload,
        ),
      };

    case ActionType.REMOVE_SEARCH_TERM_BY_INDEX:
      return {
        ...state,
        searchTerms: removeSearchTermByIndex(state.searchTerms, action.payload),
      };

    case ActionType.RESET_FACET:
      return {
        ...state,
        selectedFacetValues: resetFacet(
          state.selectedFacetValues,
          action.payload,
        ),
      };

    case ActionType.SET_DATE:
      return {
        ...state,
        date: action.payload,
      };

    case ActionType.SET_DATE_ZOOMED:
      return {
        ...state,
        date: {
          ...state.date,
          ...action.payload,
        },
      };

    case ActionType.TOGGLE_FACET_VALUE:
      return {
        ...state,
        selectedFacetValues: toggleFacetValue(
          state.selectedFacetValues,
          action.payload,
        ),
      };

    case ActionType.TOGGLE_KEY_EXISTS:
      return {
        ...state,
        keyExists: toggleKeyExists(state.keyExists, action.payload),
      };

    default:
      return state;
  }
};

const logsWorkbookReducer = (
  state: LogsWorkbook,
  action: Action,
): LogsWorkbook => {
  if (action.type === ActionType.RESTORE_HISTORY_ENTRY_BY_INDEX) {
    const historyEntry = state.history[action.payload];
    return {
      ...state,
      history: state.history.slice(0, action.payload + 1),
      logsState: historyEntry.logsState,
      saved: false,
    };
  }

  if (action.type === ActionType.CLEAR_SELECTED_LOG_FROM_CONTEXT) {
    return {
      ...state,
      selectedLogFromContext: null,
    };
  }

  if (action.type === ActionType.SET_WORKBOOK_NAME) {
    return {
      ...state,
      name: action.payload,
      saved: true,
    };
  }

  const nextLogsState = logsStateReducer(state.logsState, action);
  writeLogsStateToUrlParams(nextLogsState);
  return {
    ...state,
    logsState: nextLogsState,
    history: [
      ...state.history,
      { action, createdAt: new Date(), logsState: nextLogsState, userId: null },
    ],
    saved: false,
  };
};

const reducer = (
  state: LogsWorkbooksState,
  action: Action,
): LogsWorkbooksState => {
  if (typeof action.index === 'number') {
    const nextWorkbooks = [...state.workbooks];
    const nextWorkbook = logsWorkbookReducer(
      state.workbooks[action.index],
      action,
    );
    nextWorkbooks[action.index] = nextWorkbook;
    return {
      ...state,
      workbooks: nextWorkbooks,
    };
  }

  switch (action.type) {
    case ActionType.ADD_LOGS_WORKBOOK:
      const newLogsWorkbook = getNewLogsWorkbook();
      writeLogsStateToUrlParams(newLogsWorkbook.logsState);

      return {
        ...state,
        currentWorkbookIndex: state.workbooks.length,
        workbooks: [...state.workbooks, newLogsWorkbook],
      };

    case ActionType.REMOVE_WORKBOOK_BY_INDEX: {
      const nextWorkbooks = [...state.workbooks];
      nextWorkbooks.splice(action.payload, 1);

      const nextCurrentWorkbookIndex = Math.min(
        state.currentWorkbookIndex,
        nextWorkbooks.length - 1,
      );

      writeLogsStateToUrlParams(
        nextWorkbooks[nextCurrentWorkbookIndex].logsState,
      );

      return {
        ...state,
        currentWorkbookIndex: nextCurrentWorkbookIndex,
        workbooks: nextWorkbooks,
      };
    }

    case ActionType.SHOW_IN_CONTEXT: {
      const newLogsWorkbook = getNewLogsWorkbook();
      newLogsWorkbook.name = 'From Context';
      newLogsWorkbook.logsState = {
        ...newLogsWorkbook.logsState,
        ...action.payload.logsState,
      };
      newLogsWorkbook.selectedLogFromContext =
        action.payload.selectedLogFromContext;

      const nextWorkbooks = [...state.workbooks, newLogsWorkbook];

      return {
        ...state,
        currentWorkbookIndex: state.currentWorkbookIndex + 1,
        workbooks: nextWorkbooks,
      };
    }

    case ActionType.SET_CURRENT_WORKBOOK_INDEX:
      if (state.workbooks[action.payload]?.logsState) {
        writeLogsStateToUrlParams(state.workbooks[action.payload]?.logsState);
      }

      return {
        ...state,
        currentWorkbookIndex: action.payload,
      };

    case ActionType.SET_WORKBOOKS:
      return {
        ...state,
        currentWorkbookIndex: action.payload.length
          ? action.payload.length - 1
          : 0,
        isReady: true,
        workbooks: action.payload.length ? action.payload : state.workbooks,
      };
    default:
      return state;
  }
};

const useLogsWorkbooksState = () => {
  const [state, dispatch] = useReducer(reducer, getInitialLogsWorkbooksState());

  const addLogsWorkbook = () => {
    dispatch({ type: ActionType.ADD_LOGS_WORKBOOK });
  };

  const setCurrentWorkbookIndex = (i: number) => {
    dispatch({ type: ActionType.SET_CURRENT_WORKBOOK_INDEX, payload: i });
  };

  const createActionByIndex =
    <P>(actionType: ActionType) =>
    (args: P) => {
      dispatch({
        type: actionType,
        index: state.currentWorkbookIndex,
        payload: args,
      });
    };

  const currentLogsState = {
    ...state.workbooks[state.currentWorkbookIndex].logsState,
    addFilterByFacet: createActionByIndex<SearchItemProps>(
      ActionType.ADD_FILTER_BY_FACET,
    ),
    addSearchTerm: createActionByIndex<string>(ActionType.ADD_SEARCH_TERM),
    applyDeselectedFacetValues: createActionByIndex<{
      component: string;
      facetName: string;
      facetValuesToSelect: { [key: string]: number };
    }>(ActionType.APPLY_DESELECTED_FACET_VALUES),
    clear: createActionByIndex<string>(ActionType.CLEAR),
    clearFilterOrExcludeByFingerprint: createActionByIndex<string>(
      ActionType.CLEAR_FILTER_OR_EXCLUDE_BY_FINGERPRINT,
    ),
    clearSelectedLogFromContext: createActionByIndex<string>(
      ActionType.CLEAR_SELECTED_LOG_FROM_CONTEXT,
    ),
    excludeFingerprint: createActionByIndex<string>(
      ActionType.EXCLUDE_FINGERPRINT,
    ),
    filterFingerpint: createActionByIndex<string>(
      ActionType.FILTER_FINGERPRINT,
    ),
    filterOnlyFacetValueFromLogEventDetail: createActionByIndex<{
      name: string;
      source: string;
      value: string;
      exclude: boolean;
    }>(ActionType.FILTER_ONLY_FACET_VALUE_FROM_LOG_EVENT_DETAIL),
    removeFilterByFacetByIndex: createActionByIndex<number>(
      ActionType.REMOVE_FILTER_BY_FACET_BY_INDEX,
    ),
    removeSearchTermByIndex: createActionByIndex<number>(
      ActionType.REMOVE_SEARCH_TERM_BY_INDEX,
    ),
    resetFacet: createActionByIndex<FacetBase>(ActionType.RESET_FACET),
    setDate: createActionByIndex<DateSelection>(ActionType.SET_DATE),
    setDateZoomed: createActionByIndex<DateSelection>(
      ActionType.SET_DATE_ZOOMED,
    ),
    toggleFacetValue: createActionByIndex<{
      facetKey: string;
      nextSelectionByFacetKeys: { [key: string]: number };
    }>(ActionType.TOGGLE_FACET_VALUE),
    toggleKeyExists: createActionByIndex<FacetBase>(
      ActionType.TOGGLE_KEY_EXISTS,
    ),
  };

  const removeWorkbookByIndex = (workbookIndex: number) => {
    dispatch({
      type: ActionType.REMOVE_WORKBOOK_BY_INDEX,
      payload: workbookIndex,
    });
  };

  const restoreHistoryEntryByIndex = (
    workbookIndex: number,
    historyEntryIndex: number,
  ) => {
    dispatch({
      type: ActionType.RESTORE_HISTORY_ENTRY_BY_INDEX,
      index: workbookIndex,
      payload: historyEntryIndex,
    });
  };

  const setWorkbookName = (workbookIndex: number, name: string) => {
    dispatch({
      type: ActionType.SET_WORKBOOK_NAME,
      index: workbookIndex,
      payload: name,
    });
  };

  const setWorkbooks = (workbooks: LogsWorkbook[]) => {
    dispatch({
      type: ActionType.SET_WORKBOOKS,
      payload: workbooks,
    });
  };

  const showInContext = (payload: {
    logsState: Partial<LogsState>;
    selectedLogFromContext: LogEvent;
  }) => {
    dispatch({
      type: ActionType.SHOW_IN_CONTEXT,
      payload,
    });
  };

  return {
    ...state,
    addLogsWorkbook,
    currentWorkbook:
      state.currentWorkbookIndex < state.workbooks.length
        ? state.workbooks[state.currentWorkbookIndex]
        : null,
    currentLogsState,
    removeWorkbookByIndex,
    restoreHistoryEntryByIndex,
    setWorkbookName,
    setWorkbooks,
    setCurrentWorkbookIndex,
    showInContext,
  };
};

export default useLogsWorkbooksState;
