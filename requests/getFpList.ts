import dayjs from 'dayjs';
import { DateSelection, FilterProps, Fingerprint } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  date: DateSelection;
  selectedFacetValues: any;
  search?: string;
};

const getFpList = async ({
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  searchTerms,
}: Args): Promise<Fingerprint[]> => {
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

  return query<Fingerprint[], 'getFpList'>(`
    {
      getFpList(
        durationSecs: ${durationSecs}
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        limit: 10000,
        timestamp: "${endTime.format()}",
      ) {
        hash
        pattern
        source
        count
      }
    }
  `).then((data) => data.getFpList || [], onPromiseError);
};

export default getFpList;
