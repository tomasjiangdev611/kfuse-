import {
  ChipWithLabel,
  IconWithLabel,
  StatusTag,
  TableColumnType,
} from 'components';
import { iconsBySpanType } from 'constants';
import React from 'react';
import { formatDiffNs, formatNsAsDate } from 'utils';

type TraceFromLiveTail = {
  traceId: string;
  spanId: string;
  parentSpanId: string;
  startTimeNs: number;
  endTimeNs: number;
  attributes: Attributes;
};

type Attributes = {
  endpoint: string;
  error: string;
  hostname: string;
  kube_cluster_name: string;
  kube_namespace: string;
  method: string;
  pod_id: string;
  pod_name: string;
  region: string;
  span_type: string;
  status_code: string;
  version: string;
};

type RenderCellProps = {
  row: TraceFromLiveTail;
  value: any;
};

export enum TracesTableLiveTailColumnKey {
  startTimeNs = 'startTimeNs',
  serviceName = 'serviceName',
  name = 'name',
  duration = 'duration',
  method = 'method',
  attributesStatusCode = 'attributesStatusCode',
  endpoint = 'endpoint',
}

export const tracesTableLiveTailColumns = (colorsByServiceName: {
  [key: string]: string;
}) => [
  {
    key: TracesTableLiveTailColumnKey.startTimeNs,
    label: 'Date',
    renderCell: ({ value }: RenderCellProps) => formatNsAsDate(value as number),
  },
  {
    key: TracesTableLiveTailColumnKey.serviceName,
    label: 'Service',
    renderCell: ({ row, value }: RenderCellProps) => {
      return (
        <ChipWithLabel
          color={colorsByServiceName[value]}
          label={
            <IconWithLabel
              icon={iconsBySpanType[row.attributes?.span_type]}
              label={value}
            />
          }
        />
      );
    },
  },
  { key: TracesTableLiveTailColumnKey.name, label: 'Name' },
  {
    key: TracesTableLiveTailColumnKey.duration,
    label: 'Duration',
    renderCell: ({ row }: RenderCellProps) =>
      formatDiffNs(row.startTimeNs, row.endTimeNs),
    type: TableColumnType.NUMBER,
    value: ({ row }: RenderCellProps) => row.endTimeNs - row.startTimeNs,
  },
  { key: TracesTableLiveTailColumnKey.method, label: 'Method' },
  {
    key: TracesTableLiveTailColumnKey.attributesStatusCode,
    label: 'Status Code',
    renderCell: ({ value }: RenderCellProps) => <StatusTag status={value} />,
  },
  { key: TracesTableLiveTailColumnKey.endpoint, label: 'Endpoint' },
];
