import { ChartGrid } from 'components';
import React, { useMemo } from 'react';
import { DateSelection } from 'types';
import { queryRangeTimeDuration, formatLatencyYAxisTick } from 'utils';
import { buildFilterFromFormValues } from './utils';

const getRows = (
  date: DateSelection,
  formValues: { [key: string]: string },
  service: string,
) => {
  const timeDuration = `${queryRangeTimeDuration(date)}s`;
  const formValueFilters = buildFilterFromFormValues(formValues);
  const formValueFiltersString = formValueFilters ? `,${formValueFilters}` : '';

  return [
    [
      {
        chartType: 'bar',
        colorMap: { Success: '#c3e29c' },
        labels: [() => 'Success'],
        options: [{ label: 'Total Executions', value: 'totalExecutions' }],
        queries: () => [
          `ceil(sum by (service_name) (increase(spans_total{service_name="${service}"${formValueFiltersString}}[${timeDuration}])))`,
        ],
      },
      {
        chartType: 'bar',
        colorMap: { Failed: '#da545b' },
        labels: [() => 'Failed'],
        options: [
          { label: 'Total Failed', value: 'rate' },
          { label: 'Failure Rate', value: 'percent' },
        ],
        queries: (param: any) => [
          param === 'percent'
            ? `ceil(sum by (service_name) (increase(span_errors_total{service_name="${service}"${formValueFiltersString}}[${timeDuration}]))) / ceil(sum by (service_name) (increase(spans_total{service_name="${service}"${formValueFiltersString}}[${timeDuration}])))`
            : `ceil(sum by (service_name) (${param}(span_errors_total{service_name="${service}"${formValueFiltersString}}[${timeDuration}])))`,
        ],
      },
      {
        colorMap: { Max: '#3d8bc9', P95: '#0e9f6e', P50: '#ffd800' },
        labels: [() => 'Max', () => 'P95', () => 'P50'],
        options: [{ label: 'Build Duration', value: 'buildDuration' }],
        queries: () => [
          `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${timeDuration}])) by (service_name, le))`,
          `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${timeDuration}])) by (service_name, le))`,
          `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${service}"${formValueFiltersString}}[${timeDuration}])) by (service_name, le))`,
        ],
        yAxisTickFormatter: formatLatencyYAxisTick,
      },
    ],
  ];
};

type Props = {
  date: DateSelection;
  formValues: { [key: string]: any };
  service: string;
};

const CicdPipelineSummaryGrid = ({ date, formValues, service }: Props) => {
  const rows = useMemo(
    () => getRows(date, formValues, service),
    [date, formValues, service],
  );

  return <ChartGrid date={date} rows={rows} />;
};

export default CicdPipelineSummaryGrid;
