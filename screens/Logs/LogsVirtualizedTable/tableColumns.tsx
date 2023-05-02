import { ChipWithLabel, DateFormatter, useThemeContext } from 'components';
import { colorsByLogLevel, dateTimeFormatWithMilliseconds } from 'constants';
import React, { ReactElement } from 'react';
import { LogEvent } from 'types';
import LogsVirtualizedTableMessage from './LogsVirtualizedTableMessage';

type RenderCellProps = {
  row: LogEvent;
};

const overrideFirstColumnWithLogLevelChip = (columns) => {
  if (columns.length) {
    const firstColumn = { ...columns[0] };
    const { key, content } = firstColumn;
    const nextcontent = (args) => {
      const { row } = args;
      const label = content ? content(args) : row[key];
      return (
        <ChipWithLabel color={colorsByLogLevel[row.level]} label={label} />
      );
    };

    firstColumn.content = nextcontent;

    return [firstColumn, ...columns.slice(1)];
  }

  return columns;
};

export const CONTAINER_NAME = 'kubeContainerName';
export const HOST = 'host';
export const IMAGE = 'image';
export const KUBE_NAMESPACE = 'kubeNamespace';
export const KUBE_SERVICE = 'kubeService';
export const LOG_LEVEL = 'logLevel';
export const MESSAGE = 'message';
export const POD_NAME = 'podName';
export const SOURCE = 'source';
export const TIMESTAMP = 'timestamp';

const CONTAINER_NAME_COLUMN = {
  key: CONTAINER_NAME,
  header: 'Container Name',
  content: ({ row }: RenderCellProps) => row?.labels?.kube_container_name,
  width: 120,
};
const HOST_COLUMN = {
  key: HOST,
  header: 'Host',
  content: ({ row }: RenderCellProps) => row?.labels?.host || null,
  width: 120,
};
const KUBE_NAMESPACE_COLUMN = {
  key: KUBE_NAMESPACE,
  header: 'Kube Namespace',
  content: ({ row }: RenderCellProps) => row?.labels?.kube_namespace || null,
  width: 120,
};
const KUBE_SERVICE_COLUMN = {
  key: KUBE_SERVICE,
  header: 'Kube Service',
  content: ({ row }: RenderCellProps) => row?.labels?.kube_service || null,
  width: 120,
};
const MESSAGE_COLUMN = {
  key: MESSAGE,
  header: 'Message',
  content: ({ row }: RenderCellProps): ReactElement => {
    return <LogsVirtualizedTableMessage row={row} />;
  },
  width: 800,
};
const POD_NAME_COLUMN = {
  key: POD_NAME,
  header: 'Pod Name',
  content: ({ row }: RenderCellProps) => row?.labels?.pod_name || null,
  width: 120,
};
const SOURCE_COLUMN = {
  key: SOURCE,
  header: 'Source',
  content: ({ row }: RenderCellProps) => row?.labels?.source || null,
  width: 120,
};
const TIMESTAMP_COLUMN = {
  key: TIMESTAMP,
  header: 'Date',
  content: ({ row }: RenderCellProps) => {
    const { timestamp } = row;
    return (
      <DateFormatter
        formatString={dateTimeFormatWithMilliseconds}
        unixTimestamp={timestamp}
      />
    );
  },
  width: 180,
};

export const columns = [
  CONTAINER_NAME_COLUMN,
  TIMESTAMP_COLUMN,
  HOST_COLUMN,
  KUBE_NAMESPACE_COLUMN,
  KUBE_SERVICE_COLUMN,
  MESSAGE_COLUMN,
  POD_NAME_COLUMN,
  SOURCE_COLUMN,
];

export const tableColumns = (selectedColumns) =>
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
    ].filter((column) => Boolean(selectedColumns[column.key])),
  );
