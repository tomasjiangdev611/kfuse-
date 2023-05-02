import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaMutedAlerts = () => {
  return fetchGrafanaApi(`/grafana/api/alertmanager/grafana/api/v2/silences`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  }).then((result) => {
    return result;
  });
};

export default getGrafanaMutedAlerts;
