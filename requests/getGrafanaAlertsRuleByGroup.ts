import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaAlertsRuleByGroup = (folderName: string, groupName: string) => {
  return fetchGrafanaApi(
    `/grafana/api/ruler/grafana/api/v1/rules/${folderName}/${groupName}?subtype=cortex`,
    {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    },
  ).then((result) => {
    return result;
  });
};

export default getGrafanaAlertsRuleByGroup;
