import dayjs from 'dayjs';
import { DateSelection, FilterProps, LogEvent } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  date: DateSelection;
  fingerprints: string[];
  selectedFacetValues: any;
  search?: string;
};

const logSamples = async ({
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  fingerprints,
  keyExists,
  searchTerms,
}: Args): Promise<any> => {
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

  return query<LogEvent, 'logSample'>(`
    {
      logSample(
        durationSecs: ${durationSecs}
        fingerprints: [${fingerprints
          .map((fingerprint) => `"${fingerprint}"`)
          .join(',')}]
        ${logQuery !== '{}' ? `query: ${logQuery},` : ''}
        timestamp: "${endTime.format()}",
      ) {
        fpHash
        fpPattern
        message
        source
      }
    }
  `).then((data) => data.logSample || [], onPromiseError);
};

export default logSamples;
