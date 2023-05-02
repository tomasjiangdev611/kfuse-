import {
  ChipWithLabel,
  Loader,
  TableWithState,
  useColumnsState,
} from 'components';
import { serviceTableKpis } from 'constants';
import React from 'react';

const ServiceTable = ({
  date,
  kpisBySpanNameRequest,
  property,
  service,
  setActiveName,
}) => {
  const { colorMap, fetchSingleColumn, kpisBySpanName, tableRequest } =
    kpisBySpanNameRequest;
  const rows = tableRequest.result || [];
  const columns = [
    {
      key: 'name',
      label: 'Name',
      renderCell: ({ value }) => (
        <ChipWithLabel
          color={colorMap[value]}
          label={
            <button className="link" onClick={() => setActiveName(value)}>
              {value}
            </button>
          }
        />
      ),
    },
    ...serviceTableKpis.map((kpi) => ({
      key: kpi.key,
      label: kpi.label,
      renderCell: kpi.renderCell,
      value: ({ row }) =>
        kpisBySpanName[row.name] && kpisBySpanName[row.name][kpi.key]
          ? kpisBySpanName[row.name] && kpisBySpanName[row.name][kpi.key]
          : 0,
    })),
  ];

  const columnsState = useColumnsState({
    columns,
    initialState: {
      resizedWidths: {},
      selectedColumns: {
        name: 1,
        spanType: 1,
        requestsPerSecond: 1,
        p50latency: 1,
        p99latency: 1,
        maxlatency: 1,
        errorRate: 1,
        apdex: 1,
      },
    },
    key: 'service-table',
    onSelectedColumnToggle: ({ key, isSelected }) => {
      if (isSelected) {
        fetchSingleColumn({
          date,
          key,
          property,
          service,
        });
      }
    },
  });

  return (
    <Loader className="service__table" isLoading={tableRequest.isLoading}>
      <TableWithState columnsState={columnsState} rows={rows} />
    </Loader>
  );
};

export default ServiceTable;
