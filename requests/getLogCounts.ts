import dayjs from 'dayjs';
import { DateSelection, FacetValue, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  bucketSecs: number;
  date: DateSelection;
  filters?: any[];
  fpHash?: string;
  k8sFilters?: any[];
  logLevel?: string;
  search?: string;
};

const getLogCounts = async ({
  bucketSecs,
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  logLevel = null,
  searchTerms,
}: Args): Promise<FacetValue[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const limit = bucketSecs ? Math.ceil(durationSecs / bucketSecs) + 1 : 1;
  const logQuery = buildQuery({
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    logLevel,
    searchTerms,
  });

  return query<FacetValue[], 'getLogCounts'>(`
    {
      getLogCounts(
        bucketSecs: ${bucketSecs}
        durationSecs: ${durationSecs}
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        limit: ${limit},
        timestamp: "${endTime.format()}",
      ) {
        bucketStart
        count
        facetName
        facetValue
      }
    }
  `).then((data) => data.getLogCounts || [], onPromiseError);
};

export default getLogCounts;
