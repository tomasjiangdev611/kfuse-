import dayjs from 'dayjs';
import { DateSelection, SelectedFacetValuesByName, Span } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import { buildEventsFilter } from './utils';

type Args = {
  date: DateSelection;
  facetName: string;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const eventFacetValues = async ({
  date,
  facetName,
  selectedFacetValuesByName,
}: Args): Promise<Span[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryEventService<Span[], 'facetValues'>(`
    {
      facetValues(
        durationSecs: ${durationSecs},
        filter: ${buildEventsFilter({}, [], selectedFacetValuesByName)},
        facetName: "${facetName}",
        timestamp: "${endTime.format()}",
      ) {
        count
        value
      }
    }
  `).then((data) => data.facetValues || [], onPromiseError);
};

export default eventFacetValues;
