import dayjs from 'dayjs';
import { DateSelection } from 'types';
import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';

const promqlLabelValues = ({
  metricName,
  label,
  date,
}: {
  metricName?: string;
  label: string;
  date?: DateSelection;
}): Promise<any> => {
  const matcher = metricName ? `match[]=${metricName}` : '';
  let dateParam = '';
  if (date) {
    const { endTimeUnix, startTimeUnix } = date;
    const start = dayjs.unix(startTimeUnix).toISOString();
    const end = dayjs.unix(endTimeUnix).toISOString();
    dateParam = `&start=${start}&end=${end}`;
  }
  return fetchJson(`/api/v1/label/${label}/values?${matcher}${dateParam}`).then(
    (result) => result.data || [],
    onPromiseError,
  );
};

export default promqlLabelValues;
