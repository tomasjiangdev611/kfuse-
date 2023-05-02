import fetchGrafanaApi from './fetchGrafanaApi';

const testGrafanaContactPoint = (payload: any) => {
  return fetchGrafanaApi(
    `grafana/api/alertmanager/grafana/config/api/v1/receivers/test`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
};

export default testGrafanaContactPoint;
