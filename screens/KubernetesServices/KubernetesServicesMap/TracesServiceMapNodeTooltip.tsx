import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import { isIp } from 'utils';
import TracesServiceMapTooltip from './TracesServiceMapTooltip';
import { getTimeParameter } from './utils';

const errorsQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  const serviceNameFilter = isIp(serviceName)
    ? `server_ip="${serviceName}"`
    : `service_name="${serviceName}"`;
  return `sum by(kube_cluster_name, kube_namespace, service_name, server_ip)(rate(error{${serviceNameFilter},response_code!~"2..",kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${timeParameter}]))/sum by(kube_cluster_name, kube_namespace, service_name, server_ip)(rate(request_count{service_name="${serviceName}",kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${timeParameter}]))`;
};

const latencyQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  const serviceNameFilter = isIp(serviceName)
    ? `server_ip="${serviceName}"`
    : `service_name="${serviceName}"`;
  return `max by(kube_cluster_name, kube_namespace, service_name, server_ip) (rate(latency_sum{${serviceNameFilter},kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${timeParameter}])) / 1000000`;
};

const requestsQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  const serviceNameFilter = isIp(serviceName)
    ? `server_ip="${serviceName}"`
    : `service_name="${serviceName}"`;
  return `sum by(kube_cluster_name, kube_namespace, service_name, server_ip)(rate(request_count{${serviceNameFilter},kube_service!="datadog-agent-kube-state-metrics", kube_service!="kfuse-agent"}[${timeParameter}]))`;
};

const queryValue = (date: DateSelection, query: string) =>
  queryRange({ date, instant: true, query }).then((result) =>
    result.length && result[0].value.length > 1
      ? Number(result[0].value[1])
      : 0,
  );

const queryValues = async ({ date, serviceName }) => {
  const values = await Promise.all([
    queryValue(date, errorsQuery(date, serviceName)),
    queryValue(date, latencyQuery(date, serviceName)),
    queryValue(date, requestsQuery(date, serviceName)),
  ]);

  return {
    errors: values[0],
    latency: values[1],
    requests: values[2],
  };
};

type Props = {
  date: DateSelection;
  serviceName: string;
  selectedFacetValuesByName: SelectedFacetValuesByName;
};

const TracesServiceMapNodeTooltip = ({
  date,
  serviceName,
  selectedFacetValuesByName,
}: Props) => {
  const valuesRequest = useRequest(queryValues);
  const values = valuesRequest.result || {};

  useEffect(() => {
    valuesRequest.call({ date, serviceName, selectedFacetValuesByName });
  }, []);

  return (
    <TracesServiceMapTooltip
      isLoading={valuesRequest.isLoading}
      serviceName={serviceName}
      values={values}
    />
  );
};

export default TracesServiceMapNodeTooltip;
