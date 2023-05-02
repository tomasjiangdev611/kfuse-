import {
  ChipWithLabel,
  useThemeContext,
  useToastmasterContext,
} from 'components';
import { colorsByLogLevel, dateTimeFormat } from 'constants';
import dayjs from 'dayjs';
import React, { MutableRefObject, ReactElement } from 'react';
import { Clipboard } from 'react-feather';

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

const MESSAGE = 'message';
const SOURCE = 'source';
const TIMESTAMP = 'timestamp';

const MESSAGE_COLUMN = {
  key: MESSAGE,
  label: 'Message',
  renderCell: ({ row }: { row: any }): ReactElement => {
    return <pre className={'text--prewrap'}>{row.message}</pre>;
  },
};

const SOURCE_COLUMN = {
  key: SOURCE,
  label: 'Source',
  renderCell: ({ row }) => row?.labels?.source,
};
const TIMESTAMP_COLUMN = {
  key: TIMESTAMP,
  label: 'Date',
  renderCell: ({ row }) => {
    const { utcTimeEnabled } = useThemeContext();
    const { timestamp } = row;
    const timestampDayJs = utcTimeEnabled
      ? dayjs.utc(timestamp)
      : dayjs(timestamp);

    return timestampDayJs.format(dateTimeFormat);
  },
};

export const serverlessLogsTableColumns = overrideFirstColumnWithLogLevelChip([
  TIMESTAMP_COLUMN,
  SOURCE_COLUMN,
  MESSAGE_COLUMN,
]);
