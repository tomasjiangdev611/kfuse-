import dayjs from 'dayjs';
import { DateSelection, SelectedFacetValuesByName, Span } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import { buildEventsFilter } from './utils';

type Args = {
  date: DateSelection;
  labelName: string;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const eventLabelValues = async ({
  date,
  labelName,
  selectedFacetValuesByName,
}: Args): Promise<Span[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryEventService<Span[], 'labelValues'>(`
    {
      labelValues(
        durationSecs: ${durationSecs},
        filter: ${buildEventsFilter({}, [], selectedFacetValuesByName)},
        labelName: "${labelName}",
        timestamp: "${endTime.format()}",
      ) {
        count
        value
      }
    }
  `).then((data) => data.labelValues || [], onPromiseError);
};

export default eventLabelValues;
