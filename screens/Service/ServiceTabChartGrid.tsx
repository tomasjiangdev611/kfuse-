import { ChartGridV2 } from 'components';
import React, { useMemo } from 'react';
import { ChartLegendTableColumn, DateSelection } from 'types';
import { formatLatencyYAxisTick, multipleQueryRangeWithLabels } from 'utils';
import { buildFilterFromFormValues } from './utils';

const getRows = (
  colorMap: { [key: string]: string },
  formValues: { [key: string]: string },
  property: string,
  service: string,
  setDate: (date: DateSelection) => void,
) => {
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
                  `ceil(sum by (service_name, ${property}) (rate(spans_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])))`,
              ],
              [(metric) => metric[property]],
            ),
          },
          {
            key: 'requests',
            chartType: 'bar',
            colorMap,
            label: 'Requests',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `ceil(sum by (service_name, ${property}) (rate(spans_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )})`,
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
                  `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p95Latency',
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
                  `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p90Latency',
            colorMap,
            label: 'p90 Latency',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval }) =>
                  `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p75Latency',
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
                  `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
              ],
              [(metric) => metric[property]],
            ),
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
          {
            key: 'p50Latency',
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
                  `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, ${property}, le))`,
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
                  `ceil(sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])))`,
              ],
              [(metric) => metric[property]],
            ),
          },
          {
            key: 'errors',
            colorMap,
            label: 'Errors',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `ceil(sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )})`,
              ],
              [(metric) => metric[property]],
            ),
          },
          {
            key: 'errorsPercent',
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
                  `ceil(sum by (service_name, ${property}) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}]))) / ceil(sum by (service_name, ${property}) (increase(spans_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )})`,
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
  colorMap: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  property: string;
  service: string;
  setDate: (date: DateSelection) => void;
};

const ServiceChartGrid = ({
  colorMap,
  date,
  formValues,
  property,
  service,
  setDate,
}: Props) => {
  const rows = useMemo(
    () => getRows(colorMap, formValues, property, service, setDate),
    [colorMap, date, formValues, service],
  );
  return <ChartGridV2.ChartGrid date={date} rows={rows} />;
};

export default ServiceChartGrid;
