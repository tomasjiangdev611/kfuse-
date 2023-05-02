import {
  ChipWithLabel,
  DateFormatter,
  IconWithLabel,
  LatencyBreakdown,
  StatusTag,
  TableColumnType,
} from 'components';
import { dateTimeFormatWithMilliseconds, iconsBySpanType } from 'constants';
import React from 'react';
import { Link } from 'react-router-dom';
import { Trace } from 'types';
import { formatDiffNs } from 'utils';

type RenderCellProps = {
  row: Trace;
  value: any;
};

export enum TracesTableColumnKey {
  spanStartTimeNs = 'span.startTimeNs',
  spanAttributesServiceName = 'span.attributes.service_name',
  spanName = 'span.name',
  duration = 'duration',
  spanMethod = 'span.method',
  spanAttributesStatusCode = 'span.attributes.status_code',
  spanEndpoint = 'span.endpoint',
  traceMetrics = 'traceMetrics',
}

export const tracesTableColumns = (colorsByServiceName) => [
  {
    key: TracesTableColumnKey.spanStartTimeNs,
    label: 'Date',
    renderCell: ({ value }: RenderCellProps) => (
      <DateFormatter
        formatString={dateTimeFormatWithMilliseconds}
        unixTimestamp={Math.floor(value / 1000000)}
      />
    ),
  },
  {
    key: TracesTableColumnKey.spanAttributesServiceName,
    label: 'Service',
    renderCell: ({ row, value }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByServiceName[value]}
        label={
          <IconWithLabel
            icon={iconsBySpanType[row.span?.attributes?.span_type]}
            label={
              <Link className="link" to={`/apm/services/${value}`}>
                {value}
              </Link>
            }
          />
        }
      />
    ),
  },
  { key: TracesTableColumnKey.spanName, label: 'Name' },
  {
    key: TracesTableColumnKey.duration,
    label: 'Duration',
    renderCell: ({ row }: RenderCellProps) =>
      formatDiffNs(row.span.startTimeNs, row.span.endTimeNs),
    type: TableColumnType.NUMBER,
    value: ({ row }: RenderCellProps) =>
      row.span.endTimeNs - row.span.startTimeNs,
  },
  { key: TracesTableColumnKey.spanMethod, label: 'Method' },
  {
    key: TracesTableColumnKey.spanAttributesStatusCode,
    label: 'Status Code',
    renderCell: ({ value }: RenderCellProps) => <StatusTag status={value} />,
  },
  { key: TracesTableColumnKey.spanEndpoint, label: 'Endpoint' },
  {
    key: TracesTableColumnKey.traceMetrics,
    label: 'Latency Breakdown',
    renderCell: ({ value }: RenderCellProps) => (
      <LatencyBreakdown
        colorsByServiceName={colorsByServiceName}
        traceMetrics={value}
      />
    ),
  },
];
