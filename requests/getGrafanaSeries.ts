import { DateSelection } from 'types';
import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaSeries = (date: DateSelection, metric: SVGAnimatedString) => {
  const { startTimeUnix, endTimeUnix } = date;
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('start', String(startTimeUnix));
  urlSearchParams.append('end', String(endTimeUnix));
  urlSearchParams.append('match[]', `{__name__="${metric}"}`);
  return fetchGrafanaApi('/grafana/api/datasources/proxy/1/api/v1/series', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: urlSearchParams,
  }).then((result) => (result?.data.length ? result : []));
};

export default getGrafanaSeries;
