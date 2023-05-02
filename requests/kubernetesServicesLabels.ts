import dayjs from 'dayjs';
import { onPromiseError } from 'utils';
import fetchJson from './fetchJson';

const formatLabels = async (labels: string[]) =>
  labels.map((label) => ({ name: label }));

const kubernetesServicesLabels = ({ date }): Promise<any> => {
  const { endTimeUnix, startTimeUnix } = date;
  const start = dayjs.unix(startTimeUnix).toISOString();
  const end = dayjs.unix(endTimeUnix).toISOString();

  return fetchJson(
    `/api/v1/labels?match[]=response_count{}&start=${start}&end=${end}`,
  )
    .then(
      (result) =>
        (result.data || []).filter(
          (label) => label !== '__name__' && label !== 'labels',
        ),
      onPromiseError,
    )
    .then(formatLabels, onPromiseError);
};

export default kubernetesServicesLabels;
