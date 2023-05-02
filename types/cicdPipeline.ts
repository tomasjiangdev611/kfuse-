import { DateSelection } from './DateSelection';
import { LogEvent } from './generated';
import { ActionType } from './logs-workbook';

export type CicdPipelineState = {
  date: DateSelection;
  keyExists: { [key: string]: number };
  filterByFacets: string[];
  filterOrExcludeByFingerprint: { [key: string]: boolean };
  searchTerms: string[];
  selectedFacetValues: { [key: string]: number };
};

export type Action = {
  type: ActionType;
  index?: number;
  payload?: any;
};

export type CicdPipelineWorkbookHistoryEntry = {
  action: Action;
  createdAt: Date;
  logsState: CicdPipelineState;
  userId: string;
};

export type CicdPipelineWorkbook = {
  createdAt: Date;
  history: CicdPipelineWorkbookHistoryEntry[];
  id?: string;
  logsState: CicdPipelineState;
  name: string;
  saved?: boolean;
  selectedLogFromContext?: LogEvent;
};

export type CicdPipelineWorkbooksState = {
  isReady: boolean;
  currentWorkbookIndex: number;
  workbooks: CicdPipelineWorkbook[];
};
