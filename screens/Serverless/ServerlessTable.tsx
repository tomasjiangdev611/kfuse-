import { ChipWithLabel, Table } from 'components';
import { serverlessTableKpis } from 'constants';
import { useColorsByServiceName } from 'hooks';
import React, { useMemo } from 'react';
import { DateSelection, Service } from 'types';
import { KpisByFunctionName } from './types';

type RenderCellProps = {
  row: Service;
  value: any;
};

const columns = (
  colorsByFunctionName: { [key: string]: string },
  kpisByFunctionName: KpisByFunctionName,
  setActiveFunctionNameHandler: (functionName: string) => () => void,
) => [
  {
    key: 'name',
    label: 'Name',
    renderCell: ({ row }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByFunctionName[row.name]}
        label={
          <button onClick={setActiveFunctionNameHandler(row.name)}>
            {row.name}
          </button>
        }
      />
    ),
  },
  ...serverlessTableKpis.map((kpi) => ({
    key: kpi.key,
    label: kpi.label,
    renderCell: kpi.renderCell,
    value: ({ row }) =>
      kpisByFunctionName[row.name] && kpisByFunctionName[row.name][kpi.key]
        ? kpisByFunctionName[row.name][kpi.key]
        : 0,
  })),
];

const getRows = (kpisByFunctionName) => {
  return Object.keys(kpisByFunctionName).map((functionName) => ({
    name: functionName,
    ...kpisByFunctionName[functionName],
  }));
};

type Props = {
  colorsByFunctionName: ReturnType<typeof useColorsByServiceName>;
  kpisByFunctionName: KpisByFunctionName;
  setActiveFunctionName: (functionName: string) => void;
};

const ServerlessTable = ({
  colorsByFunctionName,
  kpisByFunctionName,
  setActiveFunctionName,
}: Props) => {
  const rows = useMemo(() => getRows(kpisByFunctionName), [kpisByFunctionName]);

  const setActiveFunctionNameHandler = (functionName: string) => () => {
    setActiveFunctionName(functionName);
  };
  return (
    <Table
      className="table--bordered table--padded"
      columns={columns(
        colorsByFunctionName,
        kpisByFunctionName,
        setActiveFunctionNameHandler,
      )}
      isSortingEnabled
      rows={rows}
    />
  );
};

export default ServerlessTable;
