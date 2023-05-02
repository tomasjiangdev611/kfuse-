import classnames from 'classnames';
import { SquareWithLabel, Table, TableColumnType } from 'components';
import { useMap } from 'hooks';
import React, { useMemo } from 'react';
import { ChartJsData, ChartLegendTableColumn } from 'types';
import { formatNumber } from 'utils';

type RenderCellProps = {
  rowIndex: number;
  value: any;
};

const renderCellAsFormattedNumber = ({ value }: RenderCellProps) =>
  formatNumber(value);

const getColumnsMap = (
  colorMap: { [key: string]: string },
  deselectedKeysMap: ReturnType<typeof useMap>,
) => ({
  [ChartLegendTableColumn.key]: {
    key: 'key',
    label: 'Name',
    renderCell: ({ row, value }: RenderCellProps) => (
      <SquareWithLabel
        className={classnames({
          'square-with-label--is-deselected': value in deselectedKeysMap.state,
        })}
        color={colorMap[value]}
        label={row.label || value}
      />
    ),
  },
  [ChartLegendTableColumn.avg]: {
    type: TableColumnType.NUMBER,
    key: 'avg',
    label: 'Avg',
    renderCell: renderCellAsFormattedNumber,
  },
  [ChartLegendTableColumn.min]: {
    type: TableColumnType.NUMBER,
    key: 'min',
    label: 'Min',
    renderCell: renderCellAsFormattedNumber,
  },
  [ChartLegendTableColumn.max]: {
    type: TableColumnType.NUMBER,
    key: 'max',
    label: 'Max',
    renderCell: renderCellAsFormattedNumber,
  },
  [ChartLegendTableColumn.sum]: {
    type: TableColumnType.NUMBER,
    key: 'sum',
    label: 'Sum',
    renderCell: renderCellAsFormattedNumber,
  },
});

type Props = {
  colorMap: { [key: string]: string };
  data: ChartJsData[];
  deselectedKeysMap: ReturnType<typeof useMap>;
  keys: string[];
  legendTableColumns: ChartLegendTableColumn[];
  toggleKey: (key: string) => void;
};

const ChartGridItemLegendTable = ({
  colorMap,
  data,
  deselectedKeysMap,
  keys,
  legendRows,
  legendTableColumns,
  toggleKey,
}: Props) => {
  const toggleKeyHandler = ({ row }) => {
    const { key } = row;
    toggleKey(key);
  };
  const columnKeys = legendTableColumns || [
    ChartLegendTableColumn.key,
    ChartLegendTableColumn.avg,
    ChartLegendTableColumn.min,
    ChartLegendTableColumn.max,
    ChartLegendTableColumn.sum,
  ];
  const columnMap = useMemo(
    () => getColumnsMap(colorMap, deselectedKeysMap),
    [colorMap, deselectedKeysMap.state],
  );

  const columns = columnKeys.map((columnKey) => columnMap[columnKey]);

  if (!legendRows.length) {
    return null;
  }

  return (
    <Table
      columns={columns}
      onRowClick={toggleKeyHandler}
      isSortingEnabled
      rows={legendRows}
    />
  );
};

export default ChartGridItemLegendTable;
