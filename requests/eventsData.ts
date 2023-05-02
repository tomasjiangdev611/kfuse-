import dayjs from 'dayjs';
import { DateSelection, SelectedFacetValuesByName, Span } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import { buildEventsFilter } from './utils';

type Args = {
  date: DateSelection;
  filterByFacets?: any;
  searchTerms: string[];
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const eventsData = async ({
  date,
  filterByFacets = {},
  searchTerms = [],
  selectedFacetValuesByName = {},
}: Args): Promise<Span[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryEventService<Span[], 'events'>(`
    {
    events(
        durationSecs: ${durationSecs},
        filter: ${buildEventsFilter(
          filterByFacets,
          searchTerms,
          selectedFacetValuesByName,
        )},
        timestamp: "${endTime.format()}",
      ) {
        id
        title
        timestamp
        text
        host
        priority
        sourceTypeName
        alertType
        aggregationKey
        eventType
        labels {
            name
            value
        }
      }
    }
  `).then((data) => data.events || [], onPromiseError);
};

export default eventsData;
