import { PrometheusDataset } from 'types';

export const formatDataset =
  (setState, key) =>
  (result: PrometheusDataset[]): void => {
    result.forEach((dataset) => {
      const { metric, value } = dataset;
      const { service_name } = metric;
      setState((prevState) => {
        const kpis = prevState[service_name]
          ? { ...prevState[service_name] }
          : {};
        kpis[key] = Number(value[1]);

        return {
          ...prevState,
          [service_name]: kpis,
        };
      });
    });
  };

export const formatKpiAsEmpty = (setState, key) => () => {
  setState((prevState) => {
    return Object.keys(prevState).reduce((obj, serviceName) => {
      const nextKpis = { ...prevState[serviceName] };
      delete nextKpis[key];

      return {
        ...obj,
        [serviceName]: nextKpis,
      };
    }, {});
  });
};
