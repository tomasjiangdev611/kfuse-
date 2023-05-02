import { ChipWithLabel, Table } from 'components';
import { useColorsByServiceName, useRequest } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import queryRange from 'requests/queryRange';
import { KpisByServiceName } from './types';
import { DateSelection } from 'types';

type RenderCellProps = {
  row: any;
  value: any;
};

const columns = (colorsByServiceName, JobData: any) => [
  {
    key: 'pipeline',
    label: 'JOB',
    renderCell: ({ row }: RenderCellProps) => {
      return (
        <ChipWithLabel
          color={colorsByServiceName[row.name]}
          label={row.span.attributes.span_name}
        />
      );
    },
  },
  {
    key: 'p50Duration',
    label: 'P50 Duration',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel label={JobData?.p50Value} />
    ),
  },
  {
    key: 'p75Duration',
    label: 'P75 Duration',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel label={JobData?.p75Value} />
    ),
  },
  {
    key: 'p90Duration',
    label: 'P90 Duration',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel label={JobData?.p90Value} />
    ),
  },
  {
    key: 'p95Duration',
    label: 'P95 Duration',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel label={JobData?.p95Value} />
    ),
  },
  {
    key: 'p99Duration',
    label: 'P99 Duration',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel label={JobData?.p99Value} />
    ),
  },
  {
    key: 'failure',
    label: 'FAILURE%',
    renderCell: ({ row }: RenderCellProps) => JobData.errorRate,
  },
];

const getRows = (kpisByServiceName) => {
  return Object.keys(kpisByServiceName).map((serviceName) => ({
    name: serviceName,
    ...kpisByServiceName[serviceName],
  }));
};

type Props = {
  colorsByServiceName: ReturnType<typeof useColorsByServiceName>;
  date: DateSelection;
  kpisByServiceName: KpisByServiceName;
};

const CicdPipelineSummaryTable = ({
  colorsByServiceName,
  date,
  kpisByServiceName,
}: Props) => {
  const [errorRate, setErrorRate] = useState();
  const [p50Value, setP50Value] = useState();
  const [p75Value, setP75Value] = useState();
  const [p90Value, setP90Value] = useState();
  const [p95Value, setP95Value] = useState();
  const [p99Value, setP99Value] = useState();
  const rows = useMemo(() => getRows(kpisByServiceName), [kpisByServiceName]);

  const cicdP95QueryRangeRequest = useRequest(queryRange);
  const cicdP50QueryRangeRequest = useRequest(queryRange);
  const cicdP75QueryRangeRequest = useRequest(queryRange);
  const cicdP90QueryRangeRequest = useRequest(queryRange);
  const cicdP99QueryRangeRequest = useRequest(queryRange);
  const cicdErrorQueryRangeRequest = useRequest(queryRange);
  useEffect(() => {
    if (rows.length > 0) {
      const timeDuration = `${date.endTimeUnix - date.startTimeUnix}s`;

      cicdP50QueryRangeRequest
        .call({
          date,
          instant: true,
          query: `histogram_quantile(0.50, sum(rate(span_latency_ms_bucket{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}", root_span="false"}[${timeDuration}])))`,
        })
        .then((output) => {
          setP50Value(output[0].value[1]);
        });
      cicdP75QueryRangeRequest
        .call({
          date,
          instant: true,
          query: `histogram_quantile(0.75, sum(rate(span_latency_ms_bucket{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}", root_span="false"}[${timeDuration}])))`,
        })
        .then((output) => {
          setP75Value(output[0].value[1]);
        });
      cicdP90QueryRangeRequest
        .call({
          date,
          instant: true,
          query: `histogram_quantile(0.90, sum(rate(span_latency_ms_bucket{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}", root_span="false"}[${timeDuration}])))`,
        })
        .then((output) => {
          setP90Value(output[0].value[1]);
        });
      cicdP95QueryRangeRequest
        .call({
          date,
          instant: true,
          query: `histogram_quantile(0.95, sum(rate(span_latency_ms_bucket{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}", root_span="false"}[${timeDuration}])))`,
        })
        .then((output) => {
          setP95Value(output[0].value[1]);
        });
      cicdP99QueryRangeRequest
        .call({
          date,
          instant: true,
          query: `histogram_quantile(0.99, sum(rate(span_latency_ms_bucket{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}", root_span="false"}[${timeDuration}])))`,
        })
        .then((output) => {
          setP99Value(output[0].value[1]);
        });
      cicdErrorQueryRangeRequest
        .call({
          date,
          instant: true,
          query: `sum by (service_name, span_name) (increase(span_errors_total{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}"}[${timeDuration}]))/sum by (service_name, span_name) (increase(spans_total{service_name="${rows[0].span.attributes.service_name}",span_name="${rows[0].span.attributes.span_name}"}[${timeDuration}]))`,
        })
        .then((output) => {
          setErrorRate(output[0].value[1]);
        });
    }
  }, [rows]);

  return (
    <Table
      className="table--bordered table--padded"
      columns={columns(colorsByServiceName, {
        p50Value,
        p75Value,
        p90Value,
        p95Value,
        p99Value,
        errorRate,
      })}
      isSortingEnabled
      rows={rows}
    />
  );
};

export default CicdPipelineSummaryTable;
