import fetchAdvanceFunctions from './fetchAdvanceFunctions';

const addAnomalyAlertMetric = ({
  expr,
  metricName,
  description,
  numTrees,
  treeSize,
  shingle,
  step,
}: {
  expr: string;
  metricName: string;
  description: string;
  numTrees: number;
  treeSize: number;
  shingle: number;
  step: number;
}): Promise<any> => {
  const data = {
    algo_name: 'rrcf',
    function: 'add_algo',
    expr: expr,
    metric_name: metricName,
    description: description,
    num_trees: numTrees,
    tree_size: treeSize,
    shingle: shingle,
    step: step,
  };

  return fetchAdvanceFunctions('/', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(data),
  }).then((result: { response: any }) => result.response);
};

export default addAnomalyAlertMetric;
