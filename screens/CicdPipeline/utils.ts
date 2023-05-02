import { serviceTableKpis } from 'constants';
import { PrometheusDataset } from 'types';

export const formatDatasets =
  (property: string) => (result: PrometheusDataset[][]) => {
    const kpisByProperty: { [key: string]: { [kpi: string]: number } } = {};

    result.forEach((datasets, i) => {
      const key = serviceTableKpis[i % serviceTableKpis.length].key;
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

export const buildFilterFromFormValues = (formValues: {
  [key: string]: any;
}): string =>
  Object.keys(formValues)
    .filter((key) => formValues[key])
    .map((key) => `${key}="${formValues[key]}"`)
    .join(',');
