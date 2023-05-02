import dayjs from 'dayjs';
import { DateSelection, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery } from './utils';

type Args = FilterProps & {
  date: DateSelection;
};

const getLabelNames = async ({
  date,
  selectedFacetValues = {},
  filterByFacets,
  filterOrExcludeByFingerprint = {},
  keyExists,
  searchTerms,
}: Args): Promise<string[]> => {
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

  return query<string[], 'getLabelNames'>(`
    {
      getLabelNames(
        durationSecs: ${durationSecs}
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        timestamp: "${endTime.format()}",
      )
    }
  `).then((data) => data.getLabelNames || [], onPromiseError);
};

export default getLabelNames;
