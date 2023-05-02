import dayjs from 'dayjs';
import { DateSelection, FacetValue, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery, formatFacetName, formatValueCounts } from './utils';

type Args = FilterProps & {
  date: DateSelection;
  facetName: string;
  facetSource: string;
  search: string;
  type: string;
};

const getLogFacetValuesCounts = async ({
  date,
  selectedFacetValues,
  facetName,
  facetSource,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  searchTerms,
  type,
}: Args): Promise<FacetValue> => {
  const startTimeUnix = date.zoomedStartTimeUnix || date.startTimeUnix;
  const endTimeUnix = date.zoomedEndTimeUnix || date.endTimeUnix;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const logQuery = buildQuery({
    selectedFacetValues,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  });

  return query<FacetValue[], 'getFacetValueCounts'>(`
    {
      getFacetValueCounts(
        durationSecs: ${durationSecs}
        facetName: "${formatFacetName(facetSource, facetName, type)}"
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        limit: 500,
        timestamp: "${endTime.format()}",
      ) {
        count
        value
      }
    }
  `)
    .then((data) => data.getFacetValueCounts || [], onPromiseError)
    .then(formatValueCounts);
};

export default getLogFacetValuesCounts;
