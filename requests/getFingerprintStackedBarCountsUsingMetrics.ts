import dayjs from 'dayjs';
import { DateSelection, FacetValue, FilterProps, TimeSeries } from 'types';
import { formatSeriesToLogCounts } from './utils';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  bucketSecs: number;
  date: DateSelection;
  filterOrExcludeByFingerprint?: any;
  logLevel?: string;
  searchTerms?: string[];
  startTimeUnix: number;
  endTimeUnix: number;
};

const getFingerprintStackedBarCountsUsingMetrics = async ({
  bucketSecs,
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  searchTerms,
}: Args): Promise<FacetValue[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const logQuery = buildQuery({
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  });

  const stepMs = bucketSecs * 1000;

  const logLevelLogCounts = await query<
    TimeSeries[],
    'getLogMetricsTimeSeries'
  >(`
    {
      getLogMetricsTimeSeries(
        durationMs: ${durationSecs * 1000}
        lookBackMs: ${stepMs}
        stepMs: ${stepMs}
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        rangeAggregate: "count_over_time"
        vectorAggregate: "sum"
        vectorAggregateGrouping: {
          groups: ["level"]
        }
        timestamp: "${endTime.format()}",
      ) {
        points {
          ts
          value
        }
        tags
      }
    }
  `)
    .then((data) => data.getLogMetricsTimeSeries || [])
    .then(formatSeriesToLogCounts);

  return logLevelLogCounts;
};

export default getFingerprintStackedBarCountsUsingMetrics;
