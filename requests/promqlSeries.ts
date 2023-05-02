import { DateSelection } from 'types';
import fetchJSON from './fetchJson';

const promqlSeries = ({
  date,
  metric,
  match,
}: {
  date: DateSelection;
  metric: string;
  match: string;
}): Promise<any> => {
  const { startTimeUnix, endTimeUnix } = date;
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('start', String(startTimeUnix));
  urlSearchParams.append('end', String(endTimeUnix));
  if (match) {
    urlSearchParams.append('match[]', match);
  }
  if (metric) {
    urlSearchParams.append('match[]', `{__name__="${metric}"}`);
  }

  return fetchJSON('/api/v1/series', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: urlSearchParams,
  }).then((result) => (result?.data.length ? result : []));
};

export default promqlSeries;
