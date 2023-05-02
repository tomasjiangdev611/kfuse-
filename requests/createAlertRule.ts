import fetchGrafanaApi from './fetchGrafanaApi';

// {
//     "name": "lolol",
//     "interval": "1m",
//     "rules": [
//         {
//             "grafana_alert": {
//                 "title": "lolol",
//                 "condition": "B",
//                 "no_data_state": "NoData",
//                 "exec_err_state": "Alerting",
//                 "data": [
//                     {
//                         "refId": "A",
//                         "datasourceUid": "IwNqnDA7k",
//                         "queryType": "",
//                         "relativeTimeRange": {
//                             "from": 600,
//                             "to": 0
//                         },
//                         "model": {
//                             "refId": "A",
//                             "hide": false
//                         }
//                     },
//                     {
//                         "refId": "B",
//                         "datasourceUid": "-100",
//                         "queryType": "",
//                         "model": {
//                             "refId": "B",
//                             "hide": false,
//                             "type": "classic_conditions",
//                             "datasource": {
//                                 "uid": "-100",
//                                 "type": "grafana-expression"
//                             },
//                             "conditions": [
//                                 {
//                                     "type": "query",
//                                     "evaluator": {
//                                         "params": [
//                                             3
//                                         ],
//                                         "type": "gt"
//                                     },
//                                     "operator": {
//                                         "type": "and"
//                                     },
//                                     "query": {
//                                         "params": [
//                                             "A"
//                                         ]
//                                     },
//                                     "reducer": {
//                                         "params": [],
//                                         "type": "last"
//                                     }
//                                 }
//                             ]
//                         }
//                     }
//                 ]
//             },
//             "for": "5m",
//             "annotations": {
//                 "description": "asldkl;askd;lk"
//             },
//             "labels": {
//                 "keykey": "valulu"
//             }
//         }
//     ]
// }

const buildPayload = (values) => {
  const {
    conditions,
    datasourceUid,
    description,
    evaluateInterval,
    evaluateLength,
    labels,
    metrics,
    shouldNotifyIfDataIsEmpty,
    name,
  } = values;

  const conditionRefId = String.fromCharCode(65 + metrics.length);

  return {
    name,
    interval: evaluateInterval,
    rules: [
      {
        grafana_alert: {
          title: name,
          condition: conditionRefId,
          no_data_state: shouldNotifyIfDataIsEmpty ? 'Alerting' : 'NoData',
          exec_err_state: 'Alerting',
          data: [
            ...metrics.map((metric, i) => {
              const refId = String.fromCharCode(65 + i);
              return {
                refId,
                datasourceUid,
                queryType: '',
                relativeTimeRange: {
                  from: 600,
                  to: 0,
                },
                model: {
                  exemplar: false,
                  expr: metric.metricName,
                  hide: false,
                  interval: '',
                  intervalMs: 1000,
                  legendFormat: '',
                  maxDataPoints: 43200,
                  refId,
                  format: 'time_series',
                },
              };
            }),
            {
              refId: conditionRefId,
              datasourceUid: '-100',
              queryType: '',
              model: {
                refId: conditionRefId,
                hide: false,
                type: 'classic_conditions',
                datasource: {
                  uid: '-100',
                  type: 'grafana-expression',
                },
                conditions: conditions.map((condition) => {
                  const { evaluator, metricIndex, operator, reducer, value } =
                    condition;
                  return {
                    type: 'query',
                    evaluator: {
                      params: [value],
                      type: evaluator,
                    },
                    operator: {
                      type: operator,
                    },
                    query: {
                      params: [String.fromCharCode(65 + metricIndex)],
                    },
                    reducer: {
                      params: [],
                      type: reducer,
                    },
                  };
                }),
              },
            },
          ],
        },
        for: evaluateLength,
        annotations: {
          description: description,
        },
        labels: labels.reduce(
          (obj, label) => ({ ...obj, [label.key]: label.value }),
          {},
        ),
      },
    ],
  };
};

const createAlertRule = (values) =>
  fetchGrafanaApi('/grafana/api/ruler/grafana/api/v1/rules/Alerts-Folder', {
    method: 'POST',
    body: JSON.stringify(buildPayload(values)),
  });

export default createAlertRule;
