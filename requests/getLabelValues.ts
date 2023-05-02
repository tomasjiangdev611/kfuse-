import dayjs from 'dayjs';
import { DateSelection, FacetValue, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery, formatValueCounts } from './utils';

type Args = FilterProps & {
  date: DateSelection;
  facetName: string;
  facetSource: string;
  search: string;
  type: string;
};

const getLabelValues = async ({
  date,
  selectedFacetValues = {},
  facetName,
  filterByFacets,
  filterOrExcludeByFingerprint = {},
  keyExists,
  searchTerms,
}: Args): Promise<FacetValue[]> => {
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

  return query<FacetValue[], 'getLabelValues'>(`
    {
      getLabelValues(
        durationSecs: ${durationSecs}
        includeCount: true
        labelName: "${facetName}"
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        limit: 500,
        timestamp: "${endTime.format()}",
      ) {
        count
        value
      }
    }
  `)
    .then((data) => data.getLabelValues || [], onPromiseError)
    .then(formatValueCounts);
};

export default getLabelValues;
