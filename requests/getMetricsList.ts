import { DateSelection } from 'types/DateSelection';
import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';

const getMetricsList = (date: DateSelection): Promise<string[]> => {
  const { endTimeUnix, startTimeUnix } = date;
  // exclude metric names starting with 'kfuse__alerts__logs'
  const matcher = `match[]={__name__!~"kfuse__alerts__logs.*"}`;
  return fetchJson(
    `/api/v1/label/__name__/values?start=${startTimeUnix}&end=${endTimeUnix}&${matcher}`,
  ).then((result) => result.data || [], onPromiseError);
};

export default getMetricsList;
