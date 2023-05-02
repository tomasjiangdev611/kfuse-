import dayjs from 'dayjs';
import { DateSelection } from 'types/DateSelection';
import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';
import { queryRangeStep } from './utils';

type Args = {
  date: DateSelection;
  instant?: boolean;
  query: string;
  step?: string;
};

const queryRange = async ({
  date,
  instant,
  query,
  step,
}: Args): Promise<any> => {
  const { endTimeUnix, startTimeUnix } = date;
  const start = dayjs.unix(startTimeUnix).toISOString();
  const end = dayjs.unix(endTimeUnix).toISOString();
  const stepString = instant
    ? ''
    : `&step=${step || `${queryRangeStep(date)}s`}`;

  const timeString = instant ? `time=${end}` : `start=${start}&end=${end}`;

  return fetchJson(
    `api/v1/${instant ? 'query' : 'query_range'}?query=${encodeURIComponent(
      query,
    )}&${timeString}${stepString}`,
  ).then((result) => result.data?.result || [], onPromiseError);
};

export default queryRange;
