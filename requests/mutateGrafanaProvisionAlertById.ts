import fetchGrafanaApi from './fetchGrafanaApi';

const mutateGrafanaProvisionAlertById = (rule: any, uid: string) => {
  return fetchGrafanaApi(`/api/v1/provisioning/alert-rules/${uid}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify(rule),
  });
};

export default mutateGrafanaProvisionAlertById;
