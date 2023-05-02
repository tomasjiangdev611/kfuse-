import dayjs from 'dayjs';
import { DateSelection, FilterProps, LogEvent } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  date: DateSelection;
  fingerprint: string;
  selectedFacetValues: any;
  search?: string;
};

const logSample = async ({
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  fingerprint,
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
        fingerprints: ["${fingerprint}"]
        ${logQuery !== '{}' ? `query: ${logQuery},` : ''}
        timestamp: "${endTime.format()}",
      ) {
        fpPattern
        message
      }
    }
  `).then(
    (data) =>
      data.logSample && data.logSample.length ? data.logSample[0] : null,
    onPromiseError,
  );
};

export default logSample;
