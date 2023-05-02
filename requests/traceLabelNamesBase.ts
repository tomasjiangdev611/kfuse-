import dayjs from 'dayjs';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';

type Args = {
  contains: string;
  date: DateSelection;
};

const traceLabelNamesBase = async ({
  contains,
  date,
}: Args): Promise<string[]> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  return queryTraceService<string[], 'labelNames'>(`
    {
      labelNames(
        ${contains ? `contains: "${contains}"` : ''}
        durationSecs: ${durationSecs},
        timestamp: "${endTime.format()}",
      )
    }
  `).then((data) => data.labelNames || [], onPromiseError);
};

export default traceLabelNamesBase;
