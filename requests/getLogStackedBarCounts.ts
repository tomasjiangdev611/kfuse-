import dayjs from 'dayjs';
import { DateSelection, FacetValue, FilterProps } from 'types';

import query from './query';
import { buildQuery, formatFacetName } from './utils';

type Args = FilterProps & {
  bucketSecs: number;
  date: DateSelection;
  filterOrExcludeByFingerprint?: any;
  logLevel?: string;
  searchTerms?: string[];
  startTimeUnix: number;
  endTimeUnix: number;
};

const getLogStackedBarCounts = async ({
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

  const logLevelLogCounts = await query<FacetValue[], 'getLogCounts'>(`
    {
      getLogCounts(
        bucketSecs: ${bucketSecs}
        durationSecs: ${durationSecs}
        facetName: "${formatFacetName('Core', 'level')}"
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        limit: 100000,
        timestamp: "${endTime.format()}",
      ) {
        bucketStart
        count
        facetName
        facetValue
      }
    }
  `).then((data) => data.getLogCounts || []);

  return logLevelLogCounts;
};

export default getLogStackedBarCounts;
