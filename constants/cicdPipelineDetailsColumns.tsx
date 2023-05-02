import {
  ChipWithLabel,
  IconWithLabel,
  LatencyBreakdown,
  StatusTag,
  TableColumnType,
} from 'components';
import { iconsBySpanType } from 'constants';
import React from 'react';
import { createSearchParams, Link } from 'react-router-dom';
import { Trace } from 'types';
import { formatDiffNs, formatNsAsDate } from 'utils';

type RenderCellProps = {
  row: Trace;
  value: any;
};

const cicdPipelineDetailsColumns = (colorsByServiceName) => [
  {
    key: 'span.startTimeNs',
    label: 'Date',
    renderCell: ({ value }: RenderCellProps) => formatNsAsDate(value as number),
  },
  {
    key: 'span.attributes.workflow_url',
    label: 'Pipepine Id',
    renderCell: ({ row, value }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByServiceName[value]}
        label={
          <IconWithLabel
            icon={iconsBySpanType[row.span?.attributes?.span_type]}
            label={
              <a
                target="_blank"
                href={value}
                rel="noreferrer"
                className="link text--weight-medium"
              >
                <u>{value.substring(value.lastIndexOf('/') + 1)}</u>
              </a>
            }
          />
        }
      />
    ),
  },
  {
    key: 'duration',
    label: 'Duration',
    renderCell: ({ row }: RenderCellProps) =>
      formatDiffNs(row.span.startTimeNs, row.span.endTimeNs),
    type: TableColumnType.NUMBER,
    value: ({ row }: RenderCellProps) =>
      row.span.endTimeNs - row.span.startTimeNs,
  },
  {
    key: 'span.attributes.commit_id',
    label: 'Commit',
    renderCell: ({ value }: RenderCellProps) => (
      <ChipWithLabel
        label={
          <Link className="link text--weight-medium" to={{}}>
            {value}
          </Link>
        }
      />
    ),
  },
];

export default cicdPipelineDetailsColumns;
