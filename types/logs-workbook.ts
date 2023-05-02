import { DateSelection } from './DateSelection';
import { LogEvent } from './generated';

export enum ActionType {
  ADD_FILTER_BY_FACET = 'ADD_FILTER_BY_FACET',
  ADD_KPL_TERM = 'ADD_KPL_TERM',
  ADD_LOGS_WORKBOOK = 'ADD_LOGS_WORKBOOK',
  ADD_SEARCH_TERM = 'ADD_SEARCH_TERM',
  APPLY_DESELECTED_FACET_VALUES = 'APPLY_DESELECTED_FACET_VALUES',
  CLEAR = 'CLEAR',
  CLEAR_FILTER_OR_EXCLUDE_BY_FINGERPRINT = 'CLEAR_FILTER_OR_EXCLUDE_BY_FINGERPRINT',
  CLEAR_SELECTED_LOG_FROM_CONTEXT = 'CLEAR_SELECTED_LOG_FROM_CONTEXT',
  EXCLUDE_FINGERPRINT = 'EXCLUDE_FINGERPRINT',
  FILTER_FINGERPRINT = 'FILTER_FINGERPRINT',
  FILTER_ONLY_FACET_VALUE_FROM_LOG_EVENT_DETAIL = 'FILTER_ONLY_FACET_VALUE_FROM_LOG_EVENT_DETAIL',
  REMOVE_FILTER_BY_FACET_BY_INDEX = 'REMOVE_FILTER_BY_FACET_BY_INDEX',
  REMOVE_KPL_TERM_BY_INDEX = 'REMOVE_KPL_TERM_BY_INDEX',
  REMOVE_SEARCH_TERM_BY_INDEX = 'REMOVE_SEARCH_TERM_BY_INDEX',
  REMOVE_WORKBOOK_BY_INDEX = 'REMOVE_WORKBOOK_BY_INDEX',
  RESET_FACET = 'RESET_FACET',
  RESTORE_HISTORY_ENTRY_BY_INDEX = 'RESTORE_HISTORY_ENTRY_BY_INDEX',
  SET_CURRENT_WORKBOOK_INDEX = 'SET_CURRENT_WORKBOOK_INDEX',
  SET_DATE = 'SET_DATE',
  SET_DATE_ZOOMED = 'SET_DATE_ZOOMED',
  SET_WORKBOOK_NAME = 'SET_WORKBOOK_NAME',
  SET_WORKBOOKS = 'SET_WORKBOOKS',
  SHOW_IN_CONTEXT = 'SHOW_IN_CONTEXT',
  TOGGLE_FACET_VALUE = 'TOGGLE_FACET_VALUE',
  TOGGLE_KEY_EXISTS = 'TOGGLE_KEY_EXISTS',
}

export type Action = {
  type: ActionType;
  index?: number;
  payload?: any;
};

export type LogsState = {
  date: DateSelection;
  keyExists: { [key: string]: number };
  filterByFacets: string[];
  filterOrExcludeByFingerprint: { [key: string]: boolean };
  searchTerms: string[];
  selectedFacetValues: { [key: string]: number };
};

export type LogsWorkbookHistoryEntry = {
  action: Action;
  createdAt: Date;
  logsState: LogsState;
  userId: string;
};

export type LogsWorkbook = {
  createdAt: Date;
  history: LogsWorkbookHistoryEntry[];
  id?: string;
  logsState: LogsState;
  name: string;
  saved?: boolean;
  selectedLogFromContext?: LogEvent;
};

export type LogsWorkbooksState = {
  isReady: boolean;
  currentWorkbookIndex: number;
  workbooks: LogsWorkbook[];
};
