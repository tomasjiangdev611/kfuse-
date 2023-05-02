import dayjs from 'dayjs';
import { onPromiseError } from 'utils';
import fetchJson from './fetchJson';

const kubernetesServicesLabelValues = ({ date, label }): Promise<any> => {
  const { endTimeUnix, startTimeUnix } = date;
  const start = dayjs.unix(startTimeUnix).toISOString();
  const end = dayjs.unix(endTimeUnix).toISOString();

  return fetchJson(
    `/api/v1/label/${label}/values?start=${start}&end=${end}`,
  ).then((result) => result.data || [], onPromiseError);
};

export default kubernetesServicesLabelValues;
