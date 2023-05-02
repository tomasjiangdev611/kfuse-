import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaDashboard = (path: string): Promise<any[]> => {
  const data = fetchGrafanaApi(`/grafana/api/search?` + path, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  });

  return data;
};

export default getGrafanaDashboard;
