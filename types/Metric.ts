export enum AggregateTypes {
  avg = 'avg',
  min = 'min',
  max = 'max',
  sum = 'sum',
}

export const AggregateTypesLabels: { [key: string]: string } = {
  [AggregateTypes.avg]: 'Average By',
  [AggregateTypes.min]: 'Min By',
  [AggregateTypes.max]: 'Max By',
  [AggregateTypes.sum]: 'Sum By',
};

export const defaultDimensionFilter: DimensionFilter = {
  isEqual: true,
  isOr: false,
  dimensionName: null,
  dimensionValue: null,
};

export const defaultMetric: Metric = {
  aggregateOn: [],
  aggregateType: AggregateTypes.avg,
  dimensionFilters: [],
  entityType: '',
  metricName: '',
  promqlQuery: '',
  shouldUsePromqlQuery: false,
};

export type DimensionFilter = {
  isEqual: boolean;
  isOr: boolean;
  dimensionName: string;
  dimensionValue: string;
};

export type Metric = {
  aggregateOn: string[];
  aggregateType: AggregateTypes;
  entityType: string;
  dimensionFilters: DimensionFilter[];
  metricName: string;
  promqlQuery?: string;
  shouldUsePromqlQuery: boolean;
};
