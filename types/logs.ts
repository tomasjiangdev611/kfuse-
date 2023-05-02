export type FacetValue = {
  key: string;
};

export type Facet = {
  count?: number;
  key: string;
  label: string;
  facetValues: FacetValue[];
  type: string;
};

export type FacetGroup = {
  key: string;
  label: string;
  facets: Facet[];
};

export type FilterOrExcludeByFingerprint = {
  [fpHash: string]: number;
};

export type Log = {
  ['@timestamp']: string;
  ['@version']: string;
  class: string;
  file: string;
  level: string;
  line_number: string;
  logger_name: string;
  mdc: string;
  message: string;
  method: string;
  source_host: string;
  thread_name: string;
};
