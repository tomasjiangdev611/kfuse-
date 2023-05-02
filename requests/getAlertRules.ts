import fetchGrafanaApi from './fetchGrafanaApi';

const getAlertRules = () =>
  fetchGrafanaApi('/grafana/api/prometheus/grafana/api/v1/rules');

export default getAlertRules;
