import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';

const deleteLogsMetric = (metricName: string): any => {
  return fetchJson('/logmetrics/' + metricName, {
    method: 'DELETE',
  }).then((result) => result || {}, onPromiseError);
};

export default deleteLogsMetric;
