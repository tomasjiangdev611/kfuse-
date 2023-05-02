import { Operation } from 'types';
import fetchJson from './fetchJson';
import { buildTracesFilterToJSON } from './utils';

const rangeAggregateByOperation = {
  avg: 'avg_over_time',
  distinctcount: 'count_distinct_over_time',
  max: 'max_over_time',
  median: 'quantile_over_time',
  min: 'min_over_time',
  p75: 'quantile_over_time',
  p90: 'quantile_over_time',
  p95: 'quantile_over_time',
  p99: 'quantile_over_time',
};

const rangeAggregateParamByOperation = {
  median: '0.5',
  p75: '0.75',
  p90: '0.90',
  p95: '0.95',
  p99: '0.99',
};

const saveTraceMetric = ({
  name,
  search,
  selectedFacetRangeByName,
  selectedFacetValuesByName,
  spanFilter,
  traceIdSearch,
}) => {
  const filter = JSON.stringify(
    buildTracesFilterToJSON({
      selectedFacetRangeByName,
      selectedFacetValuesByName,
      spanFilter,
      traceIdSearch,
    }),
  );

  const { groupBys, measure, operation } = search;
  const labels = groupBys.join(',');

  const body = {
    eval_duration_ms: 60000,
    filter,
    name,
    labels,
    range_aggregate:
      operation === null ||
      (operation === Operation.distinctcount && measure === null)
        ? 'count_over_time'
        : rangeAggregateByOperation[operation],
    range_aggregate_group: labels,
    range_aggregate_param: rangeAggregateParamByOperation[operation],
    unwrap_facet: measure === null ? '*' : measure,
  };

  return fetchJson('/trace/metrics', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export default saveTraceMetric;
