import fetchGrafanaApi from './fetchGrafanaApi';

const unmuteGrafanaAlert = (uid: string) => {
  return fetchGrafanaApi(
    `grafana/api/alertmanager/grafana/api/v2/silence/${uid}`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    },
  ).then((result) => {
    return result;
  });
};

export default unmuteGrafanaAlert;
