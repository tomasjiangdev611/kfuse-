import { ChipWithLabel, Table } from 'components';
import cicdTableKpis from 'constants/cicdTableKpis';
import { useColorsByServiceName } from 'hooks';
import React, { useMemo } from 'react';
import { createSearchParams, Link } from 'react-router-dom';
import { DateSelection } from 'types';
import { KpisByServiceName } from './types';

type RenderCellProps = {
  row: any;
  value: any;
};

const columns = (
  colorsByServiceName: { [x: string]: string },
  date: DateSelection,
  kpisByServiceName: any,
) => [
  {
    key: 'pipeline',
    label: 'Pipeline',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByServiceName[row.name]}
        label={
          <Link
            className="link text--weight-medium"
            to={{
              pathname: `/cicd/${row.span.serviceName}`,
              search: createSearchParams({
                date: JSON.stringify(date),
              }).toString(),
            }}
            state={{ rowData: row, tableData: kpisByServiceName }}
          >
            {row.span.serviceName}
          </Link>
        }
      />
    ),
  },
  {
    key: 'spanname',
    label: 'Job',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        label={
          <Link
            className="link text--weight-medium"
            to={{
              pathname: `/cicd/${row.span.serviceName}`,
              search: createSearchParams({
                date: JSON.stringify(date),
              }).toString(),
            }}
            state={{ rowData: row, tableData: kpisByServiceName }}
          >
            {row.span.attributes.span_name}
          </Link>
        }
      />
    ),
  },
  {
    key: 'branch',
    label: 'Branch',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        label={
          <Link
            className="link text--weight-medium"
            to={{
              pathname: `/cicd/${row.span.serviceName}`,
              search: createSearchParams({
                date: JSON.stringify(date),
              }).toString(),
            }}
            state={{ rowData: row, tableData: kpisByServiceName }}
          >
            {row.span.attributes.branch}
          </Link>
        }
      />
    ),
  },
  ...cicdTableKpis.map((kpi) => ({
    key: kpi.key,
    label: kpi.label,
    renderCell: kpi.renderCell,
    value: ({ row }) => row,
  })),
];

const getRows = (kpisByServiceName: KpisByServiceName) => {
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

const CicdTable = ({ colorsByServiceName, date, kpisByServiceName }: Props) => {
  const rows = useMemo(() => getRows(kpisByServiceName), [kpisByServiceName]);

  return (
    <Table
      className="table--bordered table--padded"
      columns={columns(colorsByServiceName, date, kpisByServiceName)}
      isSortingEnabled
      rows={rows}
    />
  );
};

export default CicdTable;
