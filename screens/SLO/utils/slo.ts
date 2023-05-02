import { SelectedFacetValuesByName, SLOProps, ValueCount } from 'types';
import { filterListWithSelectedSidebar } from 'utils';

export const SLOCoreFilter = [
  { name: 'Status', label: 'state', forceExpanded: false },
  { name: 'Service', label: 'service', forceExpanded: false },
  { name: 'Tags', label: 'tags', forceExpanded: false },
];

export const getSLOServiceFacetValues = (sloList: SLOProps[]) => {
  const serviceFacetValues: ValueCount[] = [];
  sloList.forEach((slo) => {
    const service = slo.service;
    const serviceFacetValue = serviceFacetValues.find(
      (facetValue) => facetValue.value === service,
    );
    if (serviceFacetValue) {
      serviceFacetValue.count += 1;
    } else {
      serviceFacetValues.push({ value: service, count: 1 });
    }
  });
  return serviceFacetValues;
};

export const filterSLOList = (
  sloList: SLOProps[],
  selectedFacetValuesByName: SelectedFacetValuesByName,
): {
  sloList: SLOProps[];
  status: ValueCount[];
  services: ValueCount[];
  tags: ValueCount[];
} => {
  const newSLOList = sloList.map((slo) => {
    return {
      ...slo,
      status: slo.statusErrorBudget?.statusColor === 'red' ? 'Breached' : 'OK',
      tags: Object.keys(slo.labels).map((key) => {
        return `${key}:${slo.labels[key]}`;
      }),
    };
  });

  const filteredSLOList = filterListWithSelectedSidebar(
    newSLOList,
    selectedFacetValuesByName,
  );

  const status: { [key: string]: number } = {};
  const services: { [key: string]: number } = {};
  const tags: { [key: string]: number } = {};
  filteredSLOList.forEach((slo: SLOProps) => {
    if (services[slo.service] === undefined) {
      services[slo.service] = 1;
    } else {
      services[slo.service] += 1;
    }

    if (status[slo.status] === undefined) {
      status[slo.status] = 1;
    } else {
      status[slo.status] += 1;
    }

    slo.tags.forEach((tag) => {
      if (status[tag] === undefined) {
        tags[tag] = 1;
      } else {
        tags[tag] += 1;
      }
    });
  });

  const statusFacetValues: ValueCount[] = [];
  Object.keys(status).forEach((key) => {
    statusFacetValues.push({ value: key, count: status[key] });
  });

  const serviceFacetValues: ValueCount[] = [];
  Object.keys(services).forEach((key) => {
    serviceFacetValues.push({ value: key, count: services[key] });
  });

  const tagsFacetValues: ValueCount[] = [];
  Object.keys(tags).forEach((key) => {
    if (key.includes(':')) {
      tagsFacetValues.push({ value: key, count: tags[key] });
    }
  });

  return {
    sloList: filteredSLOList,
    status: statusFacetValues,
    services: serviceFacetValues,
    tags: tagsFacetValues,
  };
};
