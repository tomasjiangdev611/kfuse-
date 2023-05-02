export type LogsMetricQueryProps = {
  metric: string;
  normalizeFunction: string;
  queryKey?: string;
  rangeAggregate: string;
  rangeAggregateGrouping?: string[];
  rangeAggregateExclude?: boolean;
  rangeAggregateParam?: string;
  vectorAggregate: string;
  vectorAggregateGrouping: string[];
  vectorAggregateExclude?: boolean;
  vectorAggregateParam?: string;
};
