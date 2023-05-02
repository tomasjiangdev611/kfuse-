import { DateSelection } from 'types';
import fetchGrafanaApi from './fetchGrafanaApi';

const getGrafanaLabelValues = (date: DateSelection) => {
  const { startTimeUnix, endTimeUnix } = date;
  return fetchGrafanaApi(
    `/grafana/api/datasources/proxy/1/api/v1/label/__name__/values?start=${startTimeUnix}&end=${endTimeUnix}`,
  ).then((result) =>
    (result.data || []).map((labelValue) => ({
      label: labelValue,
      value: labelValue,
    })),
  );
};

export default getGrafanaLabelValues;
