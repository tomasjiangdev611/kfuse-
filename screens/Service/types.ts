import { Trace } from 'types';

export type Kpi = {
  key: string;
  query: string;
};

export enum Property {
  spanName = 'span_name',
  version = 'version',
}

export type SidebarState = {
  activeName: string;
  activeTrace?: Trace;
  colorMap: { [key: string]: string };
};
