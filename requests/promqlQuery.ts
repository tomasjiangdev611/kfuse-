import dayjs from 'dayjs';
import { onPromiseError } from 'utils';

import fetchJson from './fetchJson';
import {
  transformInstantQueryToTable,
  transformSunburstDataset,
} from './utils';

const promqlQuery = async ({
  labels,
  promqlQueries,
  responseFormat = 'none',
  type = 'multi',
}: {
  labels?: string[];
  promqlQueries: string[];
  responseFormat?: 'none' | 'timeseries' | 'piechart' | 'table' | 'unflattened';
  type?: 'single' | 'multi';
}): Promise<any> => {
  const time = dayjs().unix();

  const datasets = await Promise.all(
    promqlQueries.map((promqlQuery: string) =>
      fetchJson(`api/v1/query?query=${promqlQuery}&time=${time}`).then(
        (result) => result.data?.result || [],
        onPromiseError,
      ),
    ),
  );

  if (responseFormat === 'unflattened') {
    return datasets;
  }

  const flattenedDatasets = datasets.reduce(
    (acc: any, dataset: any, index: number) => {
      dataset.forEach((data: any) => acc.push({ ...data, promIndex: index }));
      return acc;
    },
    [],
  );

  if (responseFormat === 'none') {
    if (type === 'single') {
      return flattenedDatasets[0];
    }
    return flattenedDatasets;
  }

  if (responseFormat === 'piechart') {
    return transformSunburstDataset(
      flattenedDatasets,
      labels,
      promqlQueries[0],
    );
  }

  if (responseFormat === 'table') {
    return transformInstantQueryToTable(flattenedDatasets);
  }

  return flattenedDatasets;
};

export default promqlQuery;
