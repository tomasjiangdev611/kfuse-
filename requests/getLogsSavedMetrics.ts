import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';

const getLogsSavedMetrics = (): any => {
  return fetchJson('/logmetrics', {
    method: 'GET',
  }).then((result) => result || [], onPromiseError);
};

export default getLogsSavedMetrics;
