import { onPromiseError } from 'utils';
import fetchJson from './fetchJson';

const getServerlessMetrics = (date: DateSelection): Promise<string[]> => {
  const { startTimeUnix } = date;
  return fetchJson(
    `/api/v1/label/__name__/values?start=${startTimeUnix}&match[]={__name__=~"aws_lambda.*"}&match[]={__name__=~"lambdainsights_*"}`,
  ).then((result) => result.data || [], onPromiseError);
};

export default getServerlessMetrics;
