import {
  DateSelection,
  PrometheusDataset,
  SelectedFacetValuesByName,
} from 'types';
import { onPromiseError } from 'utils';

import queryRange from './queryRange';

type Args = {
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const formatDatasets = (result: PrometheusDataset[]): string[] => {
  const serviceBitMap: { [key: string]: number } = {};

  result.forEach((dataset, i) => {
    const { metric } = dataset;
    const { service_name } = metric;

    if (!serviceBitMap[service_name]) {
      serviceBitMap[service_name] = 1;
    }
  });

  return Object.keys(serviceBitMap).sort();
};

const getServices = async ({ date }: Args): Promise<string[]> => {
  const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;

  const query = `sum by (service_name) (rate(spans_total[${timeDuration}]))`;

  return queryRange({ date, instant: true, query }).then(
    formatDatasets,
    onPromiseError,
  );
};

export default getServices;
