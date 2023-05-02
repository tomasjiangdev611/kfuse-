import dayjs from 'dayjs';
import { DateSelection, FacetName, FacetNameList, FilterProps } from 'types';
import { onPromiseError } from 'utils';
import query from './query';
import { buildQuery, formatFacetNames } from './utils';

type Args = FilterProps & {
  date: DateSelection;
};

const getFacetNames = async ({
  date,
  filterOrExcludeByFingerprint = {},
  selectedFacetValues = {},
  filterByFacets,
  keyExists,
  searchTerms,
}: Args): Promise<FacetName[]> => {
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

  return query<FacetNameList, 'getFacetNames'>(`
    {
      getFacetNames(
        durationSecs: ${durationSecs}
        limit: 2000,
        logQuery: ${logQuery},
        timestamp: "${endTime.format()}",
      ) {
        cursor,
        facetNames {
          name,
          source,
          type
        }
      }
    }
  `)
    .then((data) => data.getFacetNames?.facetNames || [], onPromiseError)
    .then(formatFacetNames);
};

export default getFacetNames;
