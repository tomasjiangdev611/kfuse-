import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { formatDurationNs } from 'utils';
import ServiceMapNodeTooltip from './ServiceMapNodeTooltip';
import { getTimeParameter } from './utils';

type Values = { [key: string]: number };

const errorsQuery = (
  date: DateSelection,
  parentServiceName: string,
  serviceName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name, parent_service_name, parent_span_name) (rate(trace_edge_errors_total{parent_service_name="${parentServiceName}",service_name="${serviceName}"}[${timeParameter}]))`;
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
  return `sum by (service_name, parent_service_name, parent_span_name, span_name) (rate(trace_edge_spans_total{parent_service_name="${parentServiceName}",service_name="${serviceName}"}[${timeParameter}]))`;
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

const valueitems = [
  {
    label: 'Requests',
    render: (values: Values) => `${values.requests?.toFixed(2) || 0}/s`,
  },
  {
    label: 'Max Latency',
    render: (values: Values) =>
      formatDurationNs((values.latency || 0) * 1000000, 1, 1),
  },
  { label: 'Errors', render: (values: Values) => values.errors?.toFixed(2) },
];

type Props = {
  date: DateSelection;
  parentServiceName: string;
  serviceName: string;
};

const TracesServiceMapLink = ({
  date,
  parentServiceName,
  serviceName,
}: Props) => {
  const valuesRequest = useRequest(queryValues);

  useEffect(() => {
    valuesRequest.call({
      date,
      parentServiceName,
      serviceName,
    });
  }, []);

  const isLoading = valuesRequest.isLoading;
  const values = valuesRequest.result || [];

  return (
    <div className="traces__service-map__node__tooltip">
      <div className="traces__service-map__node__tooltip__name">
        {`${parentServiceName}-${serviceName}`}
      </div>
      <div className="traces__service-map__node__tooltip__values">
        {valueitems.map((valueItem, i) => (
          <div
            className="traces__service-map__node__tooltip__values__item"
            key={i}
          >
            <div className="traces__service-map__node__tooltip__values__item__label">
              {valueItem.label}
            </div>
            <div className="traces__service-map__node__tooltip__values__item__value">
              {isLoading ? '-' : valueItem.render(values)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracesServiceMapLink;
