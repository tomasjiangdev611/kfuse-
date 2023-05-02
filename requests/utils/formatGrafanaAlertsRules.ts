import { AlertsStatusLabels } from 'constants/labels';

export const formatGrafanaAlertsStatus = (data: Array<any>) => {
  const alertsStatusBitmap: { [key: string]: number } = {};
  data.map((group: any) => {
    const { rules } = group;
    rules.map((rule: any) => {
      const health = rule.state === 'firing' ? 'alerting' : rule.health;
      if (alertsStatusBitmap[health] === undefined) {
        alertsStatusBitmap[health] = 1;
      } else {
        alertsStatusBitmap[health] += 1;
      }
    });
  });

  const statusCounts = Object.keys(alertsStatusBitmap).map((key) => {
    return {
      value: key,
      count: alertsStatusBitmap[key],
    };
  });

  return AlertsStatusLabels.map((label) => {
    const status = statusCounts.find((status) => status.value === label.value);
    return {
      ...label,
      count: status ? status.count : 0,
    };
  });
};

export const formatGrafanaAlertsStatusCortex = (data: {
  [key: string]: any;
}) => {
  const statusMapped: { [key: string]: string } = {
    firing: 'alerting',
    inactive: 'ok',
  };
  const alertsStatusBitmap: { [key: string]: number } = {};
  const folders = Object.keys(data);
  folders.map((folder) => {
    const folderData = data[folder];
    folderData.map((group: any) => {
      const { rules } = group;
      rules.map((rule: any) => {
        const grafana_alert = rule.grafana_alert;
        let health = grafana_alert.state.toLowerCase();
        health = statusMapped[health] ? statusMapped[health] : health;
        if (alertsStatusBitmap[health] === undefined) {
          alertsStatusBitmap[health] = 1;
        } else {
          alertsStatusBitmap[health] += 1;
        }
      });
    });
  });

  const statusCounts = Object.keys(alertsStatusBitmap).map((key) => {
    return {
      value: key,
      count: alertsStatusBitmap[key],
    };
  });

  return AlertsStatusLabels.map((label) => {
    const status = statusCounts.find((status) => status.value === label.value);
    return {
      ...label,
      count: status ? status.count : 0,
    };
  });
};
