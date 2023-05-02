import fetchGrafanaApi from './fetchGrafanaApi';

const mutateGrafanaDashboard = (jsonModel: any, message: string) => {
  return fetchGrafanaApi(`/grafana/api/dashboards/db/`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      dashboard: jsonModel,
      folderId: 0,
      overwrite: false,
      message: message || '',
    }),
  });
};

export default mutateGrafanaDashboard;
