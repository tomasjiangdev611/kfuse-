import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaAlertsByGroup = (groupName: string, ruleName: string) => {
  return fetchGrafanaApi(`grafana/api/prometheus/grafana/api/v1/rules`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET',
  }).then((result: { data: any }) => {
    if (result.data.groups) {
      const group = result.data.groups.find(
        (group: any) => group.name === groupName,
      );
      if (group) {
        const rule = group.rules.find((rule: any) => rule.name === ruleName);
        if (rule) {
          return rule.alerts;
        }
      }
    }
    return null;
  });
};

export default getGrafanaAlertsByGroup;
