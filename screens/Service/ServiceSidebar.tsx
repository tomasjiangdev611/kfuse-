import { ChartGridV2 } from 'components';
import { Datepicker } from 'composite';
import { useDateState, useForm } from 'hooks';
import React, { useMemo } from 'react';
import { ChartLegendTableColumn, DateSelection } from 'types';
import { formatLatencyYAxisTick, multipleQueryRangeWithLabels } from 'utils';
import ServiceMap from './ServiceMap';
import ServiceFilters from './ServiceFilters';
import ServiceSidebarSpans from './ServiceSidebarSpans';
import ServiceSidebarTraces from './ServiceSidebarTraces';
import { Property, SidebarState } from './types';
import { buildFilterFromFormValues } from './utils';

type Args = {
  colorMap: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  name: string;
  property: Property;
  service: string;
  setDate: (date: DateSelection) => void;
};

const getRows = ({
  colorMap,
  formValues,
  name,
  property,
  service,
  setDate,
}: Args) => {
  const formValueFilters = buildFilterFromFormValues(formValues);
  const formValueFiltersString = formValueFilters ? `,${formValueFilters}` : '';
  const onSelection = (startTimeUnix: number, endTimeUnix: number) => {
    setDate({ startTimeUnix, endTimeUnix });
  };

  return [
    [
      {
        charts: [
          {
            key: 'requestsPerSecond',
            chartType: 'bar',
            colorMap,
            label: 'Requests/s',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `sum by (service_name, ${property}) (rate(spans_total{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}]))`,
              ],
              [(metric) => metric[property]],
            ),
          },
          {
            key: 'requests',
            chartType: 'bar',
            colorMap,
            label: 'Requests',
            labels: [(metric) => metric[property]],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `sum by (service_name, ${property}) (rate(spans_total{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )}`,
              ],
              [(metric) => metric[property]],
            ),
          },
        ],
      },
      {
        charts: [
          {
            key: 'p99Latency',
            chartType: 'bar',
            colorMap,
            label: 'p99 Latency',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p95Latency',
            chartType: 'bar',
            colorMap,
            label: 'p95 Latency',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p90Latency',
            chartType: 'bar',
            colorMap,
            label: 'p90 Latency',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p75Latency',
            chartType: 'bar',
            colorMap,
            label: 'p75 Latency',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p50Latency',
            chartType: 'bar',
            colorMap,
            label: 'p50 Latency',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
        ],
      },
      {
        charts: [
          {
            key: 'errorsPerSecond',
            chartType: 'bar',
            colorMap,
            label: 'Errors/s',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}]))`,
              ],
              [(metric) => metric[property]],
            ),
          },
          {
            key: 'errors',
            chartType: 'bar',
            colorMap,
            label: 'Errors',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )}`,
              ],
              [(metric) => metric[property]],
            ),
          },
          {
            key: 'errorsPercentage',
            chartType: 'bar',
            colorMap,
            label: 'Errors %',
            legendTableColumns: [
              ChartLegendTableColumn.key,
              ChartLegendTableColumn.min,
              ChartLegendTableColumn.max,
              ChartLegendTableColumn.avg,
            ],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) / sum by (service_name, ${property}) (increase(spans_total{service_name="${service}",${property}="${name}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )}`,
              ],
              [(metric) => metric[property]],
            ),
          },
        ],
      },
    ],
  ];
};

type Props = {
  colorsByServiceName: { [key: string]: string };
  colorMap: { [key: string]: string };
  initialDate: DateSelection;
  initialFormValues: { [key: string]: any };
  name: string;
  property: Property;
  service: string;
  setSidebar: (sidebar: SidebarState) => void;
};

const ServiceSidebar = ({
  colorsByServiceName,
  colorMap,
  initialDate,
  initialFormValues,
  name,
  property,
  service,
  setSidebar,
}: Props) => {
  const filtersForm = useForm(initialFormValues);
  const formValues = filtersForm.values;

  const [date, setDate] = useDateState(initialDate);

  const rows = useMemo(
    () =>
      getRows({ colorMap, date, formValues, name, property, service, setDate }),
    [colorMap, date, formValues, property, service, name],
  );

  return (
    <div>
      <div className="service__sidebar__header">
        <div className="service__sidebar__header__left">
          <div className="service__sidebar__header__left__top">Scope to:</div>
          <div className="service__sidebar__header__left__bottom">
            <ServiceFilters
              date={date}
              filtersForm={filtersForm}
              serviceName={service}
            />
          </div>
        </div>
        <div className="service__sidebar__header__right">
          <Datepicker onChange={setDate} value={date} />
        </div>
      </div>
      <div className="service__sidebar__section">
        <ChartGridV2.ChartGrid date={date} rows={rows} />
      </div>
      {property === Property.spanName ? (
        <>
          <div className="service__sidebar__section">
            <div className="service__sidebar__section__header">
              <div className="service__sidebar__section__header__title">
                Dependency Map
              </div>
            </div>
            <div className="service__sidebar__section__body service__sidebar__section__body--padded">
              <ServiceMap
                colorsByServiceName={colorsByServiceName}
                date={date}
                formValues={formValues}
                name={name}
                serviceName={service}
                setSidebar={setSidebar}
              />
            </div>
          </div>
        </>
      ) : null}
      <ServiceSidebarTraces
        colorsByServiceName={colorsByServiceName}
        date={date}
        formValues={formValues}
        name={name}
        property={property}
        service={service}
        setSidebar={setSidebar}
      />
    </div>
  );
};

export default ServiceSidebar;
