import { ChipWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import { useRequest, useToggle, useUrlSearchParams } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { getTimeParameter } from './utils';
import { SidebarState } from '../types';

type Values = { [key: string]: number };

const errorsQuery = (
  date: DateSelection,
  serviceName: string,
  spanName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name, span_name) (rate(span_errors_total{service_name="${serviceName}", span_name="${spanName}"}[${timeParameter}]))`;
};

const latencyQuery = (
  date: DateSelection,
  serviceName: string,
  spanName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name, span_name) (increase(span_latency_ms_sum{service_name="${serviceName}", span_name="${spanName}"}[${timeParameter}]))/sum by (service_name, span_name) (increase(span_latency_ms_count{service_name="${serviceName}", span_name="${spanName}"}[${timeParameter}]))`;
};

const requestsQuery = (
  date: DateSelection,
  serviceName: string,
  spanName: string,
) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name, span_name) (rate(spans_total{service_name="${serviceName}", span_name="${spanName}"}[${timeParameter}]))`;
};

const valueitems = [
  {
    label: 'Requests',
    render: (values: Values) => `${values.requests?.toFixed(2) || 0}/s`,
  },
  {
    label: 'Latency',
    render: (values: Values) => `${values.latency?.toFixed(2) || 0}ms`,
  },
  { label: 'Errors', render: (values: Values) => values.errors?.toFixed(2) },
];

const queryValue = (date: DateSelection, query: string) =>
  queryRange({ date, instant: true, query }).then((result) =>
    result.length && result[0].value.length > 1
      ? Number(result[0].value[1])
      : 0,
  );

const queryValues = async ({ date, serviceName, spanName }) => {
  const values = await Promise.all([
    queryValue(date, errorsQuery(date, serviceName, spanName)),
    queryValue(date, latencyQuery(date, serviceName, spanName)),
    queryValue(date, requestsQuery(date, serviceName, spanName)),
  ]);

  return {
    errors: values[0],
    latency: values[1],
    requests: values[2],
  };
};

type Props = {
  isLoading: boolean;
  spanName: ReactNode;
  values: Values;
};

const ServiceMapNodeTooltip = ({
  date,
  isLoading,
  serviceName,
  spanName,
}: Props) => {
  const valuesRequest = useRequest(queryValues);
  const values = valuesRequest.result || {};

  useEffect(() => {
    valuesRequest.call({ date, serviceName, spanName });
  }, []);
  return (
    <div className="traces__service-map__node__tooltip">
      <div className="traces__service-map__node__tooltip__name">{spanName}</div>
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

export default ServiceMapNodeTooltip;
