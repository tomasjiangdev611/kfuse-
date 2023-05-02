import dayjs from 'dayjs';
import { DateSelection, FilterProps, Fingerprint } from 'types';
import query from './query';
import { buildQuery, formatFacetName } from './utils';

type Args = FilterProps & {
  component: string;
  date: DateSelection;
  name: string;
  type: string;
};

const getLogFacetFpList = ({
  component,
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
  keyExists,
  searchTerms,
  name,
  type,
}: Args): Promise<Fingerprint[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const logQuery = buildQuery({
    selectedFacetValues,
    facetName: formatFacetName(component, name, type),
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
        timestamp: "${endTime.format()}",
      ) {
        hash,
        source,
        pattern
      }
    }
  `).then((data) => data.getFpList || []);
};

export default getLogFacetFpList;
