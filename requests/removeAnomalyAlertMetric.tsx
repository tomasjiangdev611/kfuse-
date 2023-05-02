import fetchAdvanceFunctions from './fetchAdvanceFunctions';

const removeAnomalyAlertMetric = ({
  metricName,
}: {
  metricName: string;
}): Promise<any> => {
  const data = {
    algo_name: 'rrcf',
    function: 'remove_algo',
    metric_name: metricName,
  };

  return fetchAdvanceFunctions('/', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(data),
  }).then((result: { response: any }) => result.response);
};

export default removeAnomalyAlertMetric;
