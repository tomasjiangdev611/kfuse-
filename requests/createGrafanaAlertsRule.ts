import fetchGrafanaApi from './fetchGrafanaApi';

const createGrafanaAlertsRule = (folderName: string, payload: any) => {
  return fetchGrafanaApi(
    `/grafana/api/ruler/grafana/api/v1/rules/${folderName}?subtype=cortex`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    },
  ).then((result) => {
    return result;
  });
};

export default createGrafanaAlertsRule;
