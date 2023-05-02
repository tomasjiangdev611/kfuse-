import dayjs from 'dayjs';
import { DateSelection } from 'types/DateSelection';
import { Series } from 'uplot';
import { onPromiseError, queryRangeTimeDurationV2 } from 'utils';

import fetchJson from './fetchJson';
import { transformTimeseriesDataset } from './utils';

const promqlQueryRange = async ({
  date,
  metricNames,
  promqlQueries,
  seriesFormatter,
  steps,
  type,
}: {
  date: DateSelection;
  metricNames?: string[];
  promqlQueries: string[];
  seriesFormatter?: (idx: number, promIndex: number, metric: any) => Series;
  steps?: number[];
  type?: string;
}): Promise<any> => {
  const { endTimeUnix, startTimeUnix } = date;
  const start = dayjs.unix(startTimeUnix).toISOString();
  const end = dayjs.unix(endTimeUnix).toISOString();
  const step = queryRangeTimeDurationV2(startTimeUnix, endTimeUnix);

  const datasets = await Promise.all(
    promqlQueries.map((promqlQuery: string, idx: number) =>
      fetchJson(
        `api/v1/query_range?query=${promqlQuery}&start=${start}&end=${end}&step=${
          steps ? steps[idx] || step : step
        }s`,
      ).then((result) => result.data?.result || [], onPromiseError),
    ),
  );

  metricNames.forEach((metricName, index) => {
    const dataset = datasets[index];
    dataset.map((data: any) => {
      data.metric.__name__ = metricName;
    });
  });

  const flattenedDatasets = datasets.reduce(
    (acc: any, dataset: any, index: number) => {
      dataset.forEach((data: any) => acc.push({ ...data, promIndex: index }));
      return acc;
    },
    [],
  );

  if (type === 'timeseries') {
    return transformTimeseriesDataset({
      datasets: flattenedDatasets,
      date,
      seriesFormatter: seriesFormatter || undefined,
      step,
    });
  }

  return flattenedDatasets;
};

export default promqlQueryRange;
