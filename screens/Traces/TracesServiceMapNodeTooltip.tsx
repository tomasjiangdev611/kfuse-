import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { queryRange } from 'requests';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import TracesServiceMapTooltip from './TracesServiceMapTooltip';
import { getTimeParameter } from './utils';

const errorsQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  return `sum by (service_name) (rate(span_errors_total{service_name="${serviceName}"}[${timeParameter}]))`;
};

const latencyQuery = (date: DateSelection, serviceName: string) => {
  const timeParameter = getTimeParameter(date);
  return `max(max_over_time(span_max_latency_ms{service_name="${serviceName}"}[${timeParameter}])) by (service_name)`;
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
