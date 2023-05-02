import fetchGrafanaApi from './fetchGrafanaApi';
import { formatGrafanaAlertsStatusCortex } from './utils';

const requestListURI = [
  `grafana/api/ruler/grafana/api/v1/rules?subtype=cortex`,
  'grafana/api/prometheus/grafana/api/v1/rules',
];

const getGrafanaAlertsRules = async (type: 'rules' | 'status') => {
  const datasets: Array<any> = await Promise.all(
    requestListURI.map((uri) =>
      fetchGrafanaApi(uri, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }),
    ),
  );

  let rulerData: { [key: string]: any } = {};
  let prometheusData = {};
  datasets.forEach((dataset) => {
    if (dataset.status === 'success') {
      prometheusData = dataset.data;
    } else {
      rulerData = dataset;
    }
  });

  prometheusData.groups.forEach((group: any) => {
    const rulerDataFolder = rulerData[group.file];
    const rulerDataGroupIndex = rulerDataFolder.findIndex(
      (rulerDataGroup: any) => rulerDataGroup.name === group.name,
    );
    group.rules.forEach((rule: any, idx: number) => {
      rulerDataFolder[rulerDataGroupIndex].rules[idx].grafana_alert.state =
        rule.state;
    });
  });

  if (type === 'status') {
    return formatGrafanaAlertsStatusCortex(rulerData);
  }
  return rulerData;
};

export default getGrafanaAlertsRules;
