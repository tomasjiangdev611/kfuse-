import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaDatasets = () => {
  return fetchGrafanaApi('/grafana/api/datasources');
};

export default getGrafanaDatasets;
