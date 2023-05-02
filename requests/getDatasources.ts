import fetchGrafanaApi from './fetchGrafanaApi';

const getDatasources = () => fetchGrafanaApi('/grafana/api/datasources');

export default getDatasources;
