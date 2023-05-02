import { ChipWithLabel, DateFormatter } from 'components';
import { colorsByLogLevel, dateTimeFormatWithMilliseconds } from 'constants';
import React, { MutableRefObject, ReactElement } from 'react';
import { formatLogMessage } from 'utils';
import LogsMessage from './LogsMessage';
import { useColumnsState } from './hooks';

export const HIDE_AUTOGENERATED_PREFIXS = [
  '_duration',
  '_number',
  '_ipv4_address',
  '_uuid',
];

const overrideFirstColumnWithLogLevelChip = (columns) => {
  if (columns.length) {
    const firstColumn = { ...columns[0] };
    const { key, renderCell } = firstColumn;
    const nextRenderCell = (args) => {
      const { row } = args;
      const label = renderCell ? renderCell(args) : row[key];
      return (
        <ChipWithLabel color={colorsByLogLevel[row.level]} label={label} />
      );
    };

    firstColumn.renderCell = nextRenderCell;

    return [firstColumn, ...columns.slice(1)];
  }

  return columns;
};

export const CONTAINER_NAME = 'labels.kube_container_name';
export const HOST = 'labels.host';
export const IMAGE = 'image';
export const KUBE_NAMESPACE = 'labels.kube_namespace';
export const KUBE_SERVICE = 'labels.kube_service';
export const LOG_LEVEL = 'logLevel';
export const MESSAGE = 'message';
export const POD_NAME = 'labels.pod_name';
export const SOURCE = 'labels.source';
export const TIMESTAMP = 'timestamp';

const CONTAINER_NAME_COLUMN = {
  key: CONTAINER_NAME,
  label: 'Container Name',
  renderCell: ({ row }) => row?.labels?.kube_container_name,
  width: 100,
};
const HOST_COLUMN = {
  key: HOST,
  label: 'Host',
  renderCell: ({ row }) => row?.labels?.host,
  width: 100,
};
const KUBE_NAMESPACE_COLUMN = {
  key: KUBE_NAMESPACE,
  label: 'Kube Namespace',
  renderCell: ({ row }) => row?.labels?.kube_namespace,
  width: 100,
};
const KUBE_SERVICE_COLUMN = {
  key: KUBE_SERVICE,
  label: 'Kube Service',
  renderCell: ({ row }) => row?.labels?.kube_service,
  width: 100,
};
const MESSAGE_COLUMN = {
  key: MESSAGE,
  label: 'Message',
  renderCell: ({
    row,
  }: {
    row: any;
    tableRef: MutableRefObject<HTMLTableElement>;
    wrapText: boolean;
  }): ReactElement => {
    return <LogsMessage logEvent={row} />;
  },
  width: 800,
  value: ({ row }) => formatLogMessage(row.message),
};
const POD_NAME_COLUMN = {
  key: POD_NAME,
  label: 'Pod Name',
  renderCell: ({ row }) => row?.labels?.pod_name,
  width: 100,
};
const SOURCE_COLUMN = {
  key: SOURCE,
  label: 'Source',
  renderCell: ({ row }) => row?.labels?.source,
  width: 160,
};
const TIMESTAMP_COLUMN = {
  key: TIMESTAMP,
  label: 'Date',
  renderCell: ({ row }: { row: { timestamp: number } }) => (
    <DateFormatter
      formatString={dateTimeFormatWithMilliseconds}
      unixTimestamp={row.timestamp}
    />
  ),
  width: 160,
};

export const columns = [
  CONTAINER_NAME_COLUMN,
  HOST_COLUMN,
  KUBE_NAMESPACE_COLUMN,
  KUBE_SERVICE_COLUMN,
  MESSAGE_COLUMN,
  POD_NAME_COLUMN,
  SOURCE_COLUMN,
  TIMESTAMP_COLUMN,
];

export const tableColumns = (
  columnsState: ReturnType<typeof useColumnsState>,
) =>
  overrideFirstColumnWithLogLevelChip(
    [
      TIMESTAMP_COLUMN,
      CONTAINER_NAME_COLUMN,
      HOST_COLUMN,
      KUBE_NAMESPACE_COLUMN,
      KUBE_SERVICE_COLUMN,
      POD_NAME_COLUMN,
      SOURCE_COLUMN,
      MESSAGE_COLUMN,
    ]
      .filter((column) =>
        Boolean(columnsState.state.selectedColumns[column.key]),
      )
      .map((column) => ({
        ...column,
        width: columnsState.state.resizedWidths[column.key] || column.width,
      })),
  );