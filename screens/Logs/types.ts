import { TableColumn } from 'components';
import { LogEvent } from 'types';
import { useLogsState, useLogsWorkbooksState, useTableOptions } from './hooks';

export type LogsTableBaseProps = {
  clearHoveredLogDateUnix: () => void;
  logs: LogEvent[];
  logsState: ReturnType<typeof useLogsState>;
  selectedColumns: TableColumn<LogEvent>[];
  selectedLog: LogEvent;
  setHoveredLogDateUnix: (unixTimestamp: number) => void;
  setSelectedLog: (logEvet: LogEvent) => void;
};

export type LogsTableProps = LogsTableBaseProps & {
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  tableOptions: ReturnType<typeof useTableOptions>;
};

export type FacetBase = {
  name: string;
  type?: string;
  component: string;
};

export type LabelsProps = {
  additional: FacetBase[];
  cloud: FacetBase[];
  core: FacetBase[];
  kubernetes: FacetBase[];
};

export type SelectedLog = {
  index: number;
  logs: LogEvent[];
};
