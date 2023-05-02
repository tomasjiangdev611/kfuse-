import dayjs from 'dayjs';
import { DateSelection } from 'types';
import { onPromiseError } from 'utils';
import query from './query';

type Args = {
  date: DateSelection;
};

const logSources = async ({ date }: Args): Promise<string[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return query<string[], 'logSources'>(`
    {
      logSources(
        durationSecs: ${durationSecs}
        timestamp: "${endTime.format()}",
      )
    }
  `).then((data) => data?.logSources || [], onPromiseError);
};

export default logSources;
