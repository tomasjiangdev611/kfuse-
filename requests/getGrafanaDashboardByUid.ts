import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaDashboardByUid = (uid: string) => {
  return fetchGrafanaApi(`grafana/api/dashboards/uid/${uid}`);
};

export default getGrafanaDashboardByUid;
