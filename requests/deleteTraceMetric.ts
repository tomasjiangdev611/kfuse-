import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';

const deleteTraceMetric = (name: string): any => {
  return fetchJson(`/trace/metrics/${name}`, {
    method: 'DELETE',
  }).then((result) => result || {}, onPromiseError);
};

export default deleteTraceMetric;
