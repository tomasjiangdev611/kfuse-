import { FacetPicker, IconWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import {
  useSelectedFacetValuesByNameState,
  useRequest,
  useToggle,
} from 'hooks';
import React, { useEffect, useMemo } from 'react';
import {
  kubernetesServicesLabels,
  kubernetesServicesLabelValues,
  queryRange,
} from 'requests';
import { DateSelection, SpanFilter } from 'types';
import { buildPromQLClausesFromSelectedFacetValuesByName } from 'utils';
import { KpisByServiceName } from './types';
import useKpisByServiceNameRequest from './useKpisByServiceNameRequest';

const labelsToShowFirstRenderNames = {
  cloud_account_id: () => 'Account ID',
  cloud_availability_zone: () => 'Availability Zone',
  kube_cluster_name: () => 'Kubernetes Cluster Name',
  kube_namespace: () => 'Kubernetes Namespace',
  protocol: () => 'Protocol',
  region: () => 'Region',
};

const labelsToShoWFirstBitmap = {
  cloud_account_id: 1,
  cloud_availability_zone: 1,
  kube_cluster_name: 1,
  kube_namespace: 1,
  protocol: 1,
  region: 1,
};

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
  const kubernetesServicesLabelsRequest = useRequest(kubernetesServicesLabels);
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
    const filterClauses = buildPromQLClausesFromSelectedFacetValuesByName(
      selectedFacetValuesByNameState.state,
    );
    const filterClausesJoined = filterClauses.length
      ? `${filterClauses.join(',')},`
      : '';

    const query = `sum by(${name}, service_name)(request_count{${filterClausesJoined}kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"})`;
    return queryRange({
      date,
      instant: true,
      query,
    }).then(formatResult(name, kpisByServiceName));
  };

  useEffect(() => {
    kubernetesServicesLabelsRequest.call({ date });
  }, [date]);

  const labels = kubernetesServicesLabelsRequest.result || [];
  const labelsToShowFirst = useMemo(
    () => labels.filter((label) => labelsToShoWFirstBitmap[label.name]),
    [kubernetesServicesLabelsRequest.result],
  );

  const additionalLabels = useMemo(
    () => labels.filter((label) => !labelsToShoWFirstBitmap[label.name]),
    [kubernetesServicesLabelsRequest.result],
  );

  return (
    <div className="services__sidebar__body">
      <div className="left-sidebar__section">
        {labelsToShowFirst.map(({ name }) => (
          <FacetPicker
            clearFacet={clearFacetHandler(name)}
            key={name}
            lastRefreshedAt={date}
            name={name}
            renderName={labelsToShowFirstRenderNames[name]}
            renderValue={renderValue(name)}
            request={requestByLabelName(name)}
            selectedFacetValues={
              selectedFacetValuesByNameState.state[name] || {}
            }
            {...handlersByName(name)}
          />
        ))}
      </div>
      <div className="left-sidebar__section">
        {additionalLabels.map(({ name }) => (
          <FacetPicker
            clearFacet={clearFacetHandler(name)}
            key={name}
            lastRefreshedAt={date}
            name={name}
            renderValue={renderValue(name)}
            request={requestByLabelName(name)}
            selectedFacetValues={
              selectedFacetValuesByNameState.state[name] || {}
            }
            {...handlersByName(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesSidebar;
