import { ChipWithLabel, IconWithLabel, TableColumnType } from 'components';
import { iconsBySpanType, serviceTableKpis } from 'constants';
import React from 'react';
import { createSearchParams, Link } from 'react-router-dom';
import { DateSelection, Service } from 'types';
import { KpisByServiceName } from './types';

type RenderCellProps = {
  row: Service;
  value: any;
};

const getColumns = (
  colorsByServiceName: { [key: string]: string },
  date: DateSelection,
  kpisByServiceName: KpisByServiceName,
) => [
  {
    key: 'name',
    label: 'Name',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByServiceName[row.name]}
        label={
          <Link
            className="link text--weight-medium"
            to={{
              pathname: `/apm/services/${row.name}`,
              search: createSearchParams({
                date: JSON.stringify(date),
              }).toString(),
            }}
          >
            {row.name}
          </Link>
        }
      />
    ),
  },
  ...serviceTableKpis.map((kpi) => ({
    type: TableColumnType.NUMBER,
    key: kpi.key,
    label: kpi.label,
    renderCell: (args) =>
      args.value === undefined || isNaN(args.value)
        ? '-'
        : kpi.renderCell(args),
    value: ({ row }) =>
      kpisByServiceName[row.name] &&
      typeof kpisByServiceName[row.name][kpi.key] === 'number'
        ? kpisByServiceName[row.name][kpi.key]
        : undefined,
  })),
];

export default getColumns;
