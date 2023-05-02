import delimiter from 'constants/delimiter';
import { onPromiseError, transformGRAPQLQueryToJSON } from 'utils';
import { FilterProps } from 'types';

import { buildQuery } from './utils';
import fetchJson from './fetchJson';

type Args = {
  evalMs: number;
  filter: FilterProps;
  labels: string;
  metric: string;
  name: string;
  normalizeFunction: string;
  rangeAggregate: string;
  rangeAggregateParam: string;
};

const saveLogsMetrics = ({
  evalMs = 60000,
  filter,
  labels,
  metric,
  name,
  normalizeFunction,
  rangeAggregate,
  rangeAggregateParam,
}: Args): any => {
  const [source, facetName] = metric.split(delimiter);

  const keyExistsMetric = metric !== '*' ? { [metric]: 1 } : {};
  const filterQuery = buildQuery({
    ...filter,
    source: metric === '*' ? '' : source,
    keyExists: { ...filter.keyExists, ...keyExistsMetric },
  });
  const unwrapFacet = `@${source}.${facetName}`;
  const filterParamsJSON = transformGRAPQLQueryToJSON(filterQuery);

  const body = {
    name,
    labels,
    range_aggregate: rangeAggregate,
    range_aggregate_param: `${rangeAggregateParam}`,
    unwrap_facet: `${metric === '*' ? '*' : unwrapFacet}`,
    unwrap_function: normalizeFunction,
    filter: JSON.stringify(filterParamsJSON),
    eval_duration_ms: evalMs,
  };

  return fetchJson('/logmetrics', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((result) => result || {}, onPromiseError);
};

export default saveLogsMetrics;
