import fetchGrafanaApi from './fetchGrafanaApi';
import { getContactPoints, getContactPointsList } from './utils';

const getGrafanaAlertManager = (type?: 'contact-point' | 'contact-list') => {
  return fetchGrafanaApi(
    `grafana/api/alertmanager/grafana/config/api/v1/alerts`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    },
  ).then((result: { alertmanager_config: any }) => {
    if (type === 'contact-point') {
      return getContactPoints(result.alertmanager_config);
    }
    if (type === 'contact-list') {
      return getContactPointsList(result.alertmanager_config);
    }

    return result;
  });
};

export default getGrafanaAlertManager;
