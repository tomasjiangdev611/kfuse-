import dayjs from 'dayjs';
import { DateSelection, FacetName, FacetNameList, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import query from './query';
import { buildQuery, formatFacetNames } from './utils';

type Args = FilterProps & {
  component: string;
  date: DateSelection;
};

const getFacetNamesByComponent = async ({
  component,
  date,
  selectedFacetValues,
  filterByFacets,
  filterOrExcludeByFingerprint,
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

  return query<FacetNameList, 'getFacetNames'>(`
    {
      getFacetNames(
        durationSecs: ${durationSecs}
        ${logQuery !== '{}' ? `logQuery: ${logQuery},` : ''}
        source: "${component}"
        timestamp: "${endTime.format()}"
      ) {
        facetNames {
          name
          type
          source
        }
      }
    }
  `)
    .then((data) => data.getFacetNames?.facetNames || [], onPromiseError)
    .then(formatFacetNames);
};

export default getFacetNamesByComponent;
