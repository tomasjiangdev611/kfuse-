import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaMetadata = () => {
  return fetchGrafanaApi('/grafana/api/datasources/proxy/1/api/v1/metadata');
};

export default getGrafanaMetadata;
