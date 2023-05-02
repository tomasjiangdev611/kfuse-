import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaAlertsNotifiers = () => {
  return fetchGrafanaApi(`grafana/api/alert-notifiers`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  }).then((result) => {
    return result;
  });
};

export default getGrafanaAlertsNotifiers;
