import { ChartGridV2 } from 'components';
import React, { useMemo } from 'react';
import {
  ChartLegendTableColumn,
  DateSelection,
  SelectedFacetValuesByName,
  SpanFilter,
} from 'types';
import {
  buildPromQLFilterFromSelectedFacetValuesByName,
  formatLatencyYAxisTick,
  multipleQueryRangeWithLabels,
  queryRangeTimeDuration,
} from 'utils';

const getRows = (
  date: DateSelection,
  selectedFacetValuesByName: SelectedFacetValuesByName,
  setDate: (date: DateSelection) => void,
  spanFilter: SpanFilter,
) => {
  const filter = buildPromQLFilterFromSelectedFacetValuesByName(
    selectedFacetValuesByName,
    spanFilter,
  );

  const timeDuration = `${queryRangeTimeDuration(date)}s`;
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
                  `sum(rate(spans_total${filter}[${rateInterval}]))`,
              ],
              [() => 'Hits', () => 'Errors'],
            ),
          },
          {
            key: 'requests',
            chartType: 'bar',
            colorMap: { Hits: '#26BBF0', Errors: '#da545b' },
            label: 'Requests',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `sum(rate(spans_total${filter}[${rateInterval}])) * ${Math.round(
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
            key: 'errorsPerSecond',
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
                  `sum(rate(span_errors_total${filter}[${rateInterval}]))`,
              ],
              [() => 'Errors'],
            ),
          },
          {
            key: 'errors',
            chartType: 'bar',
            colorMap: { Errors: '#da545b' },
            label: 'Errors',
            onSelection,
            query: multipleQueryRangeWithLabels(
              [
                ({ rateInterval, stepInMs }) =>
                  `sum(rate(span_errors_total${filter}[${rateInterval}])) * ${Math.round(
                    stepInMs / 1000,
                  )}`,
              ],
              [() => 'Errors'],
            ),
          },
          {
            key: 'errorsPercentage',
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
                ({ rateInterval }) =>
                  `sum(rate(span_errors_total${filter}[${timeDuration}])) / sum(rate(spans_total${filter}[${rateInterval}]))`,
              ],
              [() => 'Errors'],
            ),
            yAxisTickFormatter: (n: number) =>
              n === 0 ? 0 : (n * 100).toFixed(2),
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
                  `histogram_quantile(0.99, sum by (le) (rate(span_latency_ms_bucket${filter}[${rateInterval}])))`,
              ],
              [() => 'p99'],
            ),
            showCompactLegend: true,
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.95, sum by (le) (rate(span_latency_ms_bucket${filter}[${rateInterval}])))`,
              ],
              [() => 'p95'],
            ),
            showCompactLegend: true,
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.90, sum by (le) (rate(span_latency_ms_bucket${filter}[${rateInterval}])))`,
              ],
              [() => 'p90'],
            ),
            showCompactLegend: true,
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.75, sum by (le) (rate(span_latency_ms_bucket${filter}[${rateInterval}])))`,
              ],
              [() => 'p75'],
            ),
            showCompactLegend: true,
            yAxisTickFormatter: formatLatencyYAxisTick,
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
                  `histogram_quantile(0.50, sum by (le) (rate(span_latency_ms_bucket${filter}[${rateInterval}])))`,
              ],
              [() => 'p50'],
            ),
            showCompactLegend: true,
            yAxisTickFormatter: formatLatencyYAxisTick,
          },
        ],
      },
    ],
  ];
};

const validFacetNamesBitmap: { [key: string]: number } = {
  cloud_account_id: 1,
  cloud_availability_zone: 1,
  region: 1,
  kube_cluster_name: 1,
  kube_namespace: 1,
  method: 1,
  status_code: 1,
  root_span: 1,
  service_entry: 1,
  service_name: 1,
  span_kind: 1,
  span_type: 1,
  telemetry_sdk_language: 1,
  telemetry_sdk_version: 1,
  version: 1,
};

const getShouldRenderChartGrid = (
  selectedFacetValuesByName: SelectedFacetValuesByName,
) => {
  const selectedFacetNames = Object.keys(selectedFacetValuesByName);
  return (
    selectedFacetNames.length === 0 ||
    selectedFacetNames.every((facetName) => validFacetNamesBitmap[facetName])
  );
};

type Props = {
  date: DateSelection;
  selectedFacetValuesByName: SelectedFacetValuesByName;
  setDate: (date: DateSelection) => void;
  spanFilter: SpanFilter;
};

const TracesChartGrid = ({
  date,
  selectedFacetValuesByName,
  setDate,
  spanFilter,
}: Props) => {
  const rows = useMemo(
    () => getRows(date, selectedFacetValuesByName, setDate, spanFilter),
    [date, selectedFacetValuesByName, spanFilter],
  );

  const shouldRenderChartGrid = useMemo(
    () => getShouldRenderChartGrid(selectedFacetValuesByName),
    [selectedFacetValuesByName],
  );

  if (shouldRenderChartGrid) {
    return (
      <div className="traces__chart-grid">
        <ChartGridV2.ChartGrid date={date} rows={rows} />
      </div>
    );
  }

  return null;
};

export default TracesChartGrid;
