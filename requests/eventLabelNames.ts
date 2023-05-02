import dayjs from 'dayjs';
import { DateSelection, FilterProps } from 'types';
import { onPromiseError } from 'utils';

import queryEventService from './queryEventService';

type Args = FilterProps & {
  date: DateSelection;
};

const eventLabelNames = async ({ date }: Args): Promise<string[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return queryEventService<string[], 'labelNames'>(`
    {
      labelNames(
        durationSecs: ${durationSecs},
        timestamp: "${endTime.format()}",
      )
    }
  `).then((data) => data.labelNames || [], onPromiseError);
};

export default eventLabelNames;
