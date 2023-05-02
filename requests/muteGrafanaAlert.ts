import fetchGrafanaApi from './fetchGrafanaApi';

const muteGrafanaAlert = (payload: any) => {
  return fetchGrafanaApi(`grafana/api/alertmanager/grafana/api/v2/silences`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((result) => {
    return result;
  });
};

export default muteGrafanaAlert;
