import { delimiter } from 'constants';

import getLogMetricsTimeSeries from './getLogMetricsTimeSeries';
import { formatLogsTimeseriesDataset } from './utils';

const getLogMetricsTimeseriesMultiple = ({
  date,
  filterByFacets,
  filterOrExcludeByFingerprint = {},
  keyExists,
  queries,
  searchTerms,
  selectedFacetValues = {},
  width,
}) => {
  return Promise.all(
    queries
      .filter((query) => query.metric)
      .map((query) => {
        const { metric, normalizeFunction } = query;
        const [source, name] = metric.split(delimiter);
        /**
         * When normalizeFunction is count it will count log lines
         * 1. rangeAggregate will be null
         * 2. name will be null
         * 3. keyExists will be the metric
         */
        return getLogMetricsTimeSeries({
          date,
          filterByFacets,
          filterOrExcludeByFingerprint,
          keyExists,
          name: normalizeFunction !== 'count' ? name : '',
          normalizeFunction:
            normalizeFunction !== 'number' && normalizeFunction !== 'count'
              ? normalizeFunction
              : null,
          rangeAggregate: query.rangeAggregate,
          rangeAggregateExclude: query.rangeAggregateExclude,
          rangeAggregateGrouping: query.rangeAggregateGrouping,
          rangeAggregateParam: query.rangeAggregateParam,
          searchTerms,
          selectedFacetValues,
          source: name ? source : '',
          vectorAggregate: query.vectorAggregate,
          vectorAggregateExclude: query.vectorAggregateExclude,
          vectorAggregateGrouping: query.vectorAggregateGrouping,
          vectorAggregateParam: query.vectorAggregateParam,
          width,
        }).then((dataset) => ({ name, dataset }));
      }),
  ).then(formatLogsTimeseriesDataset);
};

export default getLogMetricsTimeseriesMultiple;
