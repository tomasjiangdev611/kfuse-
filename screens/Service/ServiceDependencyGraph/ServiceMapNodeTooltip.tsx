import { ChipWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import { useRequest, useToggle, useUrlSearchParams } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { pickUrlSearchParamsByKeys } from 'utils';
import { getTimeParameter } from './utils';

const errorsQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name) (rate(span_errors_total{service_name="${serviceName}"}[${timeParameter}]))`;
};

const latencyQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name) (increase(span_latency_ms_sum{service_name="${serviceName}"}[${timeParameter}]))/sum by (service_name, span_name) (increase(span_latency_ms_count{service_name="${serviceName}"}[${timeParameter}]))`;
};

const requestsQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name) (rate(spans_total{service_name="${serviceName}"}[${timeParameter}]))`;
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

type Values = { [key: string]: number };

const valueitems = [
  {
    label: 'Requests',
    render: (values: Values) => `${values.requests?.toFixed(2) || 0}/s`,
  },
  {
    label: 'Max Latency',
    render: (values: Values) => `${values.latency?.toFixed(2) || 0}ms`,
  },
  { label: 'Errors', render: (values: Values) => values.errors?.toFixed(2) },
];

type Props = {
  isLoading: boolean;
  serviceName: ReactNode;
  values: Values;
};

const ServiceMapNodeTooltip = ({ data, date }: Props) => {
  const valuesRequest = useRequest(queryValues);
  const { service_name: serviceName, span_type: spanType } =
    data?.attributes || {};

  const isLoading = valuesRequest.isLoading;
  const values = valuesRequest.result || {};

  useEffect(() => {
    valuesRequest.call({ date, serviceName });
  }, []);

  return (
    <div className="traces__service-map__node__tooltip">
      <div className="traces__service-map__node__tooltip__name">
        {serviceName}
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

export default ServiceMapNodeTooltip;
