import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaProvisionAlertById = (uid: string) => {
  return fetchGrafanaApi(`/api/v1/provisioning/alert-rules/${uid}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  }).then((result) => {
    return result;
  });
};

export default getGrafanaProvisionAlertById;
