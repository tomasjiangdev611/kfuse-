import dayjs from 'dayjs';
import { DateSelection, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import queryEventService from './queryEventService';

type Args = FilterProps & {
  date: DateSelection;
};

const eventFacetNames = async ({ date }: Args): Promise<string[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return queryEventService<string[], 'facetNames'>(`
    {
        facetNames(
        durationSecs: ${durationSecs}
        timestamp: "${endTime.format()}",
      )
    }
  `).then((data) => data.facetNames || [], onPromiseError);
};

export default eventFacetNames;
