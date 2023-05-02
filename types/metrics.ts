export enum RangeAggregate {
  rate = 'rate',
  rate_counter = 'rate_counter',
  sum_over_time = 'sum_over_time',
  avg_over_time = 'avg_over_time',
  max_over_time = 'max_over_time',
  min_over_time = 'min_over_time',
  // first_over_time = 'first_over_time',
  last_over_time = 'last_over_time',
  // stdvar_over_time = 'stdvar_over_time',
  // stddev_over_time = 'stddev_over_time',
  // quantile_over_time = 'quantile_over_time',
  // absent_over_time = 'absent_over_time',
  count_over_time = 'count_over_time',
}

export enum VectorAggregate {
  sum = 'sum',
  avg = 'avg',
  min = 'min',
  max = 'max',
  // stddev = 'stddev',
  // stdvar = 'stdvar',
  count = 'count',
  // topk = 'topk',
  // bottomk = 'bottomk',
}

export const RangeAggregatesWithoutGrouping: { [key: string]: number } = {
  [RangeAggregate.rate]: 1,
  [RangeAggregate.rate_counter]: 1,
};

export const RangeAggregatesForCount: { [key: string]: number } = {
  [RangeAggregate.rate]: 1,
  [RangeAggregate.count_over_time]: 1,
};

export const RangeAggregatesWithParams: { [key: string]: number } = {
  [RangeAggregate.quantile_over_time]: 1,
};

export const VectorAggregatesWithParams: { [key: string]: number } = {
  [VectorAggregate.topk]: 1,
  [VectorAggregate.bottomk]: 1,
};
