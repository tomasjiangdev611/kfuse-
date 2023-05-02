import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { Group } from '@visx/group';
import TracesServiceMapNodeTooltip from './TracesServiceMapNodeTooltip';
import TracesServiceMapTooltip from './TracesServiceMapTooltip';
import { getTimeParameter } from './utils';

const errorsQuery = (
  date: DateSelection,
  parentServiceName: string,
  serviceName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name, parent_service_name) (rate(trace_edge_errors_total{parent_service_name="${parentServiceName}",service_name="${serviceName}"}[${timeParameter}]))`;
};

const latencyQuery = (
  date: DateSelection,
  parentServiceName: string,
  serviceName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `max (max_over_time(trace_edge_max_latency_ms{parent_service_name="${parentServiceName}",service_name="${serviceName}"}[${timeParameter}])) by (service_name,parent_service_name,span_name,parent_span_name)`;
};

const requestsQuery = (
  date: DateSelection,
  parentServiceName: string,
  serviceName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name, parent_service_name) (rate(trace_edge_spans_total{parent_service_name="${parentServiceName}",service_name="${serviceName}"}[${timeParameter}]))`;
};

const queryValue = (date: DateSelection, query: string) =>
  queryRange({ date, instant: true, query }).then((result) =>
    result.length && result[0].value.length > 1
      ? Number(result[0].value[1])
      : 0,
  );

const queryValues = async ({ date, parentServiceName, serviceName }) => {
  const values = await Promise.all([
    queryValue(date, errorsQuery(date, parentServiceName, serviceName)),
    queryValue(date, latencyQuery(date, parentServiceName, serviceName)),
    queryValue(date, requestsQuery(date, parentServiceName, serviceName)),
  ]);

  return {
    errors: values[0],
    latency: values[1],
    requests: values[2],
  };
};

const TracesServiceMapLinkTooltip = ({ date, edge }) => {
  const parentServiceName = edge.source;
  const serviceName = edge.target;
  const label = `${parentServiceName}-${serviceName}`;

  const valuesRequest = useRequest(queryValues);

  useEffect(() => {
    valuesRequest.call({ date, parentServiceName, serviceName });
  }, [date]);

  return (
    <div className="traces__service-map__link__tooltip">
      <TracesServiceMapTooltip
        isLoading={valuesRequest.isLoading}
        serviceName={label}
        values={valuesRequest.result || {}}
      />
    </div>
  );
};

export default TracesServiceMapLinkTooltip;
