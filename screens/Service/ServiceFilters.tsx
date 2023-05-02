import { useForm } from 'hooks';
import React from 'react';
import { queryRange } from 'requests';
import { DateSelection, PrometheusDataset } from 'types';
import { facetNames } from './constants';
import ServiceFiltersItem from './ServiceFiltersItem';

const formatResult =
  (name: string) =>
  (result: PrometheusDataset[]): string[] => {
    return result
      .filter((dataset) => dataset.metric[name])
      .map((dataset) => {
        const { metric } = dataset;
        const value = metric[name];
        return value;
      });
  };

type Props = {
  date: DateSelection;
  filtersForm: ReturnType<typeof useForm>;
  serviceName: string;
};

const ServiceFilters = ({ date, filtersForm, serviceName }: Props) => {
  const requestByLabelName = (facetName: string, serviceName: string) => () =>
    queryRange({
      date,
      instant: true,
      query: `sum by (${facetName}) (spans_total{service_name="${serviceName}"})`,
    }).then(formatResult(facetName));

  return (
    <div className="service__filters">
      {facetNames.map((facetName) => (
        <ServiceFiltersItem
          facetName={facetName.name}
          filtersForm={filtersForm}
          key={facetName.name}
          label={facetName.renderName()}
          request={requestByLabelName(facetName.name, serviceName)}
        />
      ))}
    </div>
  );
};

export default ServiceFilters;
