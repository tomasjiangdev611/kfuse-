import dayjs from 'dayjs';
import { DateSelection, Maybe, FacetName } from 'types';
import { onPromiseError } from 'utils';
import query from './query';
import { formatFacetNames } from './utils';

type Args = {
  date: DateSelection;
  facet: string;
};

const getFacetsNamesGivenExistingFacet = async ({
  date,
  facet,
}: Args): Promise<Maybe<Array<FacetName>>> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return query(`
    {
      getFacetNames(
        durationSecs: ${durationSecs}
        logQuery: { keyExists: "${facet}"}
        limit: 1000
        timestamp: "${endTime.format()}",
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

export default getFacetsNamesGivenExistingFacet;
