import { serverlessTableKpis } from 'constants';
import { PrometheusDataset } from 'types';

type Result = { [key: string]: { [kpi: string]: number } };

export const formatDatasets =
  (property: string) =>
  (result: PrometheusDataset[][]): Result => {
    const kpisByProperty: Result = {};

    result.forEach((datasets, i) => {
      const key = serverlessTableKpis[i % serverlessTableKpis.length].key;
      datasets.forEach((dataset) => {
        const { metric, value } = dataset;
        const propertyValue = metric[property];

        if (!kpisByProperty[propertyValue]) {
          kpisByProperty[propertyValue] = {};
        }

        if (value.length > 1) {
          kpisByProperty[propertyValue][key] = Number(value[1]);
        }
      });
    });

    return kpisByProperty;
  };

import { DateSelection } from 'types';

export const queryRangeStep = (date: DateSelection): number => {
  const { startTimeUnix, endTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;
  if (diffInSeconds > 60 * 60 * 24 * 30) {
    return 60 * 60;
  }

  if (diffInSeconds > 60 * 60 * 24 * 7) {
    return 60 * 10;
  }

  if (diffInSeconds > 60 * 60 * 24) {
    return 60 * 5;
  }

  if (diffInSeconds > 60 * 60 * 2) {
    return 60;
  }

  if (diffInSeconds > 60 * 30) {
    return 30;
  }

  return 15;
};

export default queryRangeStep;
