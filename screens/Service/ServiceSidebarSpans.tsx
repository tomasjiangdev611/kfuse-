import classnames from 'classnames';
import { useRequest, useToggle } from 'hooks';
import React from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { getPromQLTimeParameter } from 'utils';
import ServiceSidebarSpansTable from './ServiceSidebarSpansTable';
import { SidebarState } from './types';
import { buildFilterFromFormValues } from './utils';

const getKpis = (
  date: DateSelection,
  formValues: { [key: string]: any },
  service: string,
  spanName: string,
) => {
  const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;
  const formValueFilters = buildFilterFromFormValues(formValues);
  const formValueFiltersString = formValueFilters ? `,${formValueFilters}` : '';

  return [
    {
      key: 'avgSpansPerTrace',
      label: 'Avg Spans per Trace',
      query: `sum by (service_name, span_name) (increase(trace_span_count{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))/sum by (service_name, span_name) (increase(trace_execution_time_ms_count{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))`,
    },
    {
      key: 'errorRateBySpan',
      label: 'Error Rate by Span',
      query: `sum by (service_name, span_name) (increase(span_errors_total{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))/sum by (service_name, span_name) (increase(spans_total{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))`,
    },
    {
      key: 'averageDuration',
      label: 'Average Duration',
      query: `sum by (service_name, span_name) (increase(span_latency_ms_sum{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))/sum by (service_name, span_name) (increase(span_latency_ms_count{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))`,
    },
    {
      key: 'averagePercentExecutionTime',
      label: 'Avg % Execution Time',
      query: `sum by (service_name, span_name) (increase(trace_edge_latency_ms_sum{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))/sum by (service_name, span_name) (increase(trace_execution_time_ms_sum{service_name="${service}",span_name="${spanName}"${formValueFiltersString}}[${timeDuration}]))`,
    },
  ];
};

const fetchKpisPerSpan = async (date, formValues, service, spanName) => {
  const kpis = getKpis(date, formValues, service, spanName);
  const kpiValues = await Promise.all(
    kpis.map((kpi) => queryRange({ date, instant: true, query: kpi.query })),
  );

  return {
    serviceName: service,
    spanName: spanName,
    ...kpiValues.reduce(
      (obj, kpiValue, i) => ({
        ...obj,
        [kpis[i].key]:
          kpiValue.length && kpiValue[0].value.length > 1
            ? Number(kpiValue[0].value[1])
            : 0,
      }),
      {},
    ),
  };
};

const formatResult =
  (
    date: DateSelection,
    formValues: { [key: string]: any },
    isDownStream: boolean,
  ) =>
  async (result) => {
    const kpiValuesPerSpan = await Promise.all(
      result.map((dataset) =>
        fetchKpisPerSpan(
          date,
          formValues,
          isDownStream
            ? dataset.metric.service_name
            : dataset.metric.parent_service_name,
          isDownStream
            ? dataset.metric.span_name
            : dataset.metric.parent_span_name,
        ),
      ),
    );

    return kpiValuesPerSpan;
  };

const spansQuery = (
  date: DateSelection,
  formValues: { [key: string]: any },
  isDownStream: boolean,
  spanName: string,
  serviceName: string,
) => {
  const timeParameter = getPromQLTimeParameter(date);
  const formValueFilters = buildFilterFromFormValues(formValues);
  const formValueFiltersString = formValueFilters ? `,${formValueFilters}` : '';

  return `sum by (service_name, parent_service_name, span_name, parent_span_name,span_type) (rate(trace_edge_spans_total{${
    isDownStream ? 'parent_span_name' : 'span_name'
  }="${spanName}",${
    isDownStream
      ? `parent_service_name="${serviceName}"`
      : `service_name="${serviceName}"`
  }${formValueFiltersString}}[${timeParameter}]))`;
};

const fetchSpans =
  (
    isDownStream?: boolean,
    formValues: { [key: string]: any },
    serviceName: string,
  ) =>
  ({ date, spanName }) =>
    queryRange({
      date,
      instant: true,
      query: spansQuery(date, formValues, isDownStream, spanName, serviceName),
    }).then(formatResult(date, formValues, isDownStream));

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  serviceName: string;
  setSidebar: (sidebar: SidebarState) => void;
  spanName: string;
};

const ServiceSidebarSpans = ({
  colorsByServiceName,
  date,
  formValues,
  serviceName,
  setSidebar,
  spanName,
}: Props) => {
  const isDownStreamToggle = useToggle();
  const downstreamSpansRequest = useRequest(
    fetchSpans(true, formValues, serviceName),
  );
  const upstreamSpansRequest = useRequest(
    fetchSpans(false, formValues, serviceName),
  );

  return (
    <div className="service__sidebar__section">
      <div className="service__sidebar__section__header">
        <div className="service__sidebar__section__header__title">
          Span Summary
        </div>
        <div className="service__sidebar__section__header__actions">
          <div className="logs__tabs">
            <button
              className={classnames({
                logs__tabs__item: true,
                'logs__tabs__item--active': !isDownStreamToggle.value,
              })}
              onClick={isDownStreamToggle.off}
            >
              Upstream
            </button>
            <button
              className={classnames({
                logs__tabs__item: true,
                'logs__tabs__item--active': isDownStreamToggle.value,
              })}
              onClick={isDownStreamToggle.on}
            >
              Downstream
            </button>
          </div>
        </div>
      </div>
      <div className="service__sidebar__section__body">
        <ServiceSidebarSpansTable
          colorsByServiceName={colorsByServiceName}
          date={date}
          key={String(isDownStreamToggle.value)}
          request={
            isDownStreamToggle.value
              ? downstreamSpansRequest
              : upstreamSpansRequest
          }
          rows={
            isDownStreamToggle.value
              ? downstreamSpansRequest.result || []
              : upstreamSpansRequest.result || []
          }
          setSidebar={setSidebar}
          spanName={spanName}
        />
      </div>
    </div>
  );
};

export default ServiceSidebarSpans;
