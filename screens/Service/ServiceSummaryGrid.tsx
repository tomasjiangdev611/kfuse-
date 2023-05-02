import { ChartGridV2 } from 'components';
import React, { useMemo } from 'react';
import { getLatencyDistribution } from 'requests';
import {
  ChartJsData,
  ChartGridItem,
  ChartGridReferenceLine,
  ChartLegendTableColumn,
  DateSelection,
  LatencyDistribution,
} from 'types';
import {
  formatDurationNs,
  formatLatencyYAxisTick,
  multipleQueryRangeWithLabels,
} from 'utils';
import ServiceDependencyGraph from './ServiceDependencyGraph';
import { buildFilterFromFormValues } from './utils';

const xAxisTickFormatter = (labels: number[]) => {
  return (labelIndex: number) => formatDurationNs(labels[labelIndex] * 1000000);
};

const formatLatencyDistribution = (
  result: LatencyDistribution & { durationSecs: number; numBuckets: number },
): ChartGridItem => {
  const data: ChartJsData[] = [];
  const referenceLines: ChartGridReferenceLine[] = [];
  const timestamps: number[] = [];

  const { buckets, percentiles } = result;
  const barDurationInMs = buckets[1].bucketStart;

  buckets.forEach((bucket, i) => {
    data.push({ 'Number of Requests': bucket.count });
    timestamps.push(bucket.bucketStart);

    const startValue = i === 0 ? 0 : buckets[i - 1].bucketStart;
    const endValue = bucket.bucketStart;

    Object.keys(percentiles).forEach((p: keyof typeof percentiles) => {
      const value = percentiles[p];
      if (value >= startValue && value < endValue) {
        referenceLines.push({ x: i, label: p });
      }
    });
  });

  return {
    data,
    keys: ['Number of Requests'],
    referenceLines,
    renderTooltipTimestamp: ({ index }: { index: number }) => {
      const start = formatDurationNs(barDurationInMs * index * 1000000, 1, 2);
      const end = formatDurationNs(
        barDurationInMs * (index + 1) * 1000000,
        1,
        2,
      );
      return (
        <div className="logs__timeline__chart__tooltip__label">{`Duration: ${start} - ${end} (${formatDurationNs(
          barDurationInMs * 1000000,
          1,
          1,
        )})`}</div>
      );
    },
    timestamps,
  };
};

const getRows = (
  colorsByServiceName: { [key: string]: string },
  date: DateSelection,
  formValues: { [key: string]: string },
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
            colorMap: { Hits: '#26BBF0', Errors: '#da545b' },
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
                  `sum by (service_name) (rate(spans_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}]))`,
              ],
              [() => 'Hits', () => 'Errors'],
            ),
          },
          {
            chartType: 'bar',
            key: 'requestsAndErrors',
            colorMap: { Hits: '#26BBF0', Errors: '#da545b' },
            label: 'Requests and Errors',
            labels: [() => 'Hits', () => 'Errors'],
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `sum by (service_name) (rate(spans_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )}`,
                ({ rateInterval, stepInMs }) =>
                  `sum by (service_name) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )}`,
              ],
              [() => 'Hits', () => 'Errors'],
            ),
          },
        ],
      },
      {
        charts: [
          {
            key: 'p99latency',
            colorMap: {
              p99: '#003f5c',
              p95: '#58508d',
              p90: '#bc5090',
              p75: '#ff6361',
              p50: '#ffa600',
            },
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, le))`,
              ],
              [() => 'p99'],
            ),
          },
          {
            key: 'p95latency',
            colorMap: {
              p99: '#003f5c',
              p95: '#58508d',
              p90: '#bc5090',
              p75: '#ff6361',
              p50: '#ffa600',
            },
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, le))`,
              ],
              [() => 'p95'],
            ),
          },
          {
            key: 'p90latency',
            colorMap: {
              p99: '#003f5c',
              p95: '#58508d',
              p90: '#bc5090',
              p75: '#ff6361',
              p50: '#ffa600',
            },
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, le))`,
              ],
              [() => 'p90'],
            ),
          },
          {
            key: 'p75latency',
            colorMap: {
              p99: '#003f5c',
              p95: '#58508d',
              p90: '#bc5090',
              p75: '#ff6361',
              p50: '#ffa600',
            },
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, le))`,
              ],
              [() => 'p75'],
            ),
          },
          {
            key: 'p50latency',
            colorMap: {
              p99: '#003f5c',
              p95: '#58508d',
              p90: '#bc5090',
              p75: '#ff6361',
              p50: '#ffa600',
            },
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) by (service_name, le))`,
              ],
              [() => 'p50'],
            ),
          },
          {
            key: 'latencyDistribution',
            chartType: 'bar',
            datasetsFormatter: formatLatencyDistribution,
            instant: true,
            label: 'Latency Distribution',
            query: (args) =>
              getLatencyDistribution({ ...args, serviceName: service }).then(
                formatLatencyDistribution,
              ),
            xAxisTickFormatter,
          },
        ],
      },
      {
        charts: [
          {
            key: 'rate',
            chartType: 'bar',
            colorMap: { Errors: '#da545b' },
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
                  `ceil(sum by (service_name) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])))`,
              ],
              [() => 'Errors'],
            ),
          },
          {
            key: 'increase',
            chartType: 'bar',
            colorMap: { Errors: '#da545b' },
            label: 'Errors',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `ceil(sum by (service_name) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )})`,
              ],
              [() => 'Errors'],
            ),
          },
          {
            key: 'percent',
            chartType: 'bar',
            colorMap: { Errors: '#da545b' },
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
                  `ceil(sum by (service_name) (rate(span_errors_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}]))) / ceil(sum by (service_name) (increase(spans_total{service_name="${service}"${formValueFiltersString}}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )})`,
              ],
              [() => 'Errors'],
            ),
          },
        ],
      },
    ],
    [
      {
        charts: [
          {
            key: 'dependencyGraph',
            disableLogScale: true,
            label: 'Dependency Graph',
            render: () => (
              <div className="chart-grid__item__visualization">
                <ServiceDependencyGraph
                  colorsByServiceName={colorsByServiceName}
                  date={date}
                  formValues={formValues}
                  key={service}
                  serviceName={service}
                />
              </div>
            ),
          },
        ],
      },
    ],
  ];
};

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  service: string;
  setDate: (date: DateSelection) => void;
};

const ServiceSummaryGrid = ({
  colorsByServiceName,
  date,
  formValues,
  service,
  setDate,
}: Props) => {
  const rows = useMemo(
    () => getRows(colorsByServiceName, date, formValues, service, setDate),
    [date, formValues, service],
  );
  return <ChartGridV2.ChartGrid date={date} rows={rows} />;
};

export default ServiceSummaryGrid;
