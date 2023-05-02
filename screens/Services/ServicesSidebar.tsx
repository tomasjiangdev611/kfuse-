import { FacetPicker, IconWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import { useSelectedFacetValuesByNameState, useToggle } from 'hooks';
import React from 'react';
import { queryRange } from 'requests';
import { DateSelection, SpanFilter } from 'types';
import { buildPromQLFilterFromSelectedFacetValuesByName } from 'utils';
import { KpisByServiceName } from './types';
import useKpisByServiceNameRequest from './useKpisByServiceNameRequest';

const facetNames = [
  { name: 'kube_namespace', renderName: () => 'Kubernetes Namespace' },
  { name: 'kube_cluster_name', renderName: () => 'Kubernetes Cluster Name' },
  { name: 'span_type', renderName: () => 'Type' },
  { name: 'cloud_availability_zone', renderName: () => 'Availability Zone' },
  { name: 'cloud_account_id', renderName: () => 'Cloud Account ID' },
  { name: 'telemetry_sdk_language', renderName: () => 'Language' },
  { name: 'region', renderName: () => 'Region' },
  { name: 'telemetry_sdk_version', renderName: () => 'Version' },
];

const langaugeIconByValue: { [key: string]: string } = {
  cpp: 'cplusplus',
  dotnet: 'dot-net',
};

const formatResult =
  (name: string, kpisByServiceName: KpisByServiceName) => (result) => {
    const servicesBitmap = Object.keys(kpisByServiceName).reduce(
      (obj, serviceName) => ({ ...obj, [serviceName]: 1 }),
      {},
    );

    const countsByValue = {};
    result.forEach((dataset) => {
      const { metric } = dataset;
      const value = metric[name];
      if (value && servicesBitmap[metric.service_name]) {
        if (!countsByValue[value]) {
          countsByValue[value] = 0;
        }

        countsByValue[value] += 1;
      }
    });

    return Object.keys(countsByValue).map((value) => ({
      count: countsByValue[value],
      value,
    }));
  };

type Props = {
  date: DateSelection;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  showSidebarToggle: ReturnType<typeof useToggle>;
  kpisByServiceName: KpisByServiceName;
  kpisByServiceNameRequest: ReturnType<typeof useKpisByServiceNameRequest>;
};

const ServicesSidebar = ({
  date,
  selectedFacetValuesByNameState,
  kpisByServiceName,
  kpisByServiceNameRequest,
  showSidebarToggle,
}: Props) => {
  const clearFacetHandler = (name: string) => () => {
    selectedFacetValuesByNameState.clearFacet(name);
  };

  const handlersByName = (name: string) => ({
    excludeFacetValue: (value: string) => {
      selectedFacetValuesByNameState.excludeFacetValue({ name, value });
    },
    selectOnlyFacetValue: (value: string) => {
      selectedFacetValuesByNameState.selectOnlyFacetValue({ name, value });
    },
    toggleFacetValue: (value: string) => {
      selectedFacetValuesByNameState.toggleFacetValue({ name, value });
    },
  });

  const renderValue = (name: string) => (value: string) => {
    if (name === 'span_type') {
      const icon = iconsBySpanType[value] || null;
      return <IconWithLabel icon={icon} label={value} />;
    }

    if (name === 'telemetry_sdk_language') {
      return (
        <IconWithLabel
          icon={
            <i
              className={`devicon-${
                langaugeIconByValue[value] || value
              }-plain colored`}
            ></i>
          }
          label={value}
        />
      );
    }
    return value;
  };

  const requestByLabelName = (name: string) => () => {
    const filter =
      name === 'span_type'
        ? buildPromQLFilterFromSelectedFacetValuesByName(
            selectedFacetValuesByNameState.state,
            SpanFilter.serviceEntrySpans,
          )
        : buildPromQLFilterFromSelectedFacetValuesByName(
            selectedFacetValuesByNameState.state,
          );

    const query = `sum by (${name}, service_name) (spans_total${filter})`;
    return queryRange({
      date,
      instant: true,
      query,
    }).then(formatResult(name, kpisByServiceName));
  };

  return (
    <div className="services__sidebar__body">
      {facetNames.map(({ name, renderName }) => (
        <FacetPicker
          clearFacet={clearFacetHandler(name)}
          key={name}
          lastRefreshedAt={kpisByServiceNameRequest.lastRefreshedAt}
          name={name}
          renderName={renderName}
          renderValue={renderValue(name)}
          request={requestByLabelName(name)}
          selectedFacetValues={selectedFacetValuesByNameState.state[name] || {}}
          {...handlersByName(name)}
        />
      ))}
    </div>
  );
};

export default ServicesSidebar;
