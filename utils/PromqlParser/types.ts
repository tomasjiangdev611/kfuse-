export type VisualizeQuery = {
  binaryQueries?: VisualizeQueryBinaryQuery[];
  metric: string;
  labels: VisualizeQueryLabel[];
  operations: VisualizeQueryOperation[];
};

export type VisualizeQueryLabel = {
  label: string;
  op: string;
  value: string;
};

export type VisualizeQueryOperationParamValue = string | number | boolean;
export type VisualizeQueryOperation = {
  id: string;
  params: VisualizeQueryOperationParamValue[];
};

export type VisualizeContext = {
  binaryQueries?: VisualizeQueryBinaryQuery[];
  query: VisualizeQuery;
  errors: any[];
};

export type VisualizeQueryBinaryQuery = {
  operator: string;
  query: VisualizeQuery;
  vectorMatchesType?: 'on' | 'ignoring';
  vectorMatches?: string;
};

export type VisualizeQueryBinaryMatcher = {
  isBool: boolean;
  isMatcher: boolean;
  matches?: string;
  matchType?: 'ignoring' | 'on';
};
