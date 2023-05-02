import fetchGrafanaApi from './fetchGrafanaApi';

const mutateGrafanaContactPoints = (payload: any) => {
  return fetchGrafanaApi(
    `grafana/api/alertmanager/grafana/config/api/v1/alerts`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    },
  ).then((result) => {
    return result;
  });
};

export default mutateGrafanaContactPoints;
