import { DateSelection } from 'types';
import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaLabels = (date: DateSelection) => {
  const { startTimeUnix, endTimeUnix } = date;
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('start', String(startTimeUnix));
  urlSearchParams.append('end', String(endTimeUnix));
  return fetchGrafanaApi(`/grafana/api/datasources/proxy/1/api/v1/labels`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: urlSearchParams,
  });
};

export default getGrafanaLabels;
