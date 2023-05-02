import classnames from 'classnames';
import React, { ReactElement, ReactNode, useRef } from 'react';
import {
  TableElement,
  TbodyElement,
  TheadElement,
  TrElement,
} from './components';
import defaultRenderHeader from './defaultRenderHeader';
import getResizedRowStyle from './getResizedRowStyle';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { TableColumn, TableRowProps } from './types';

import useTableSort from './useTableSort';
import useTableResizer from './useTableResizer';

interface Props<T> {
  className?: string;
  columns: TableColumn<T>[];
  externalTableSort?: ReturnType<typeof useTableSort>;
  isFullWidth?: boolean;
  isResizingEnabled?: boolean;
  isSortingEnabled?: boolean;
  isStickyHeaderEnabled?: boolean;
  onRowClick?: ({ row }: { row: T }) => void;
  onScrollEnd?: VoidFunction;
  renderHeader?: ({ column }: { column: TableColumn<T> }) => ReactNode;
  renderRow?: (props: TableRowProps<T>) => ReactNode;
  rows: T[];
  tableWidth?: number;
}

const defaultProps = {
  tableWidth: 0,
};

const Table = <T extends { id?: string; [key: string]: unknown }>({
  className,
  columns,
  externalTableSort,
  isFullWidth,
  isResizingEnabled,
  isSortingEnabled = false,
  isStickyHeaderEnabled = false,
  onRowClick,
  onScrollEnd,
  renderHeader,
  renderRow,
  rows,
  tableWidth,
}: Props<T>): ReactElement => {
  const tableRef = useRef<HTMLTableElement>(null);
  const onRowClickHandler = (row: T) => () => {
    if (onRowClick) {
      onRowClick({ row });
    }
  };

  const tableSort = useTableSort({ columns, rows });
  const { isTableReady, onMouseMoveHandler, registerWidth, widths } =
    useTableResizer({
      columns,
    });
  const totalWidth = Math.max(
    columns.reduce((sum, column) => sum + widths[column.key], 0),
    tableWidth,
  );
  const columnKeysBitmap: { [key: string]: number } = columns.reduce(
    (obj, column) => ({ ...obj, [column.key]: 1 }),
    {},
  );
  const shouldRenderDiv =
    Object.keys(widths).filter((key) => columnKeysBitmap[key] && widths[key])
      .length >= columns.length;

  return (
    <>
      {isTableReady && (
        <TableElement
          ref={tableRef}
          className={classnames({ table: true, [className]: className })}
          shouldRenderDiv={shouldRenderDiv}
        >
          <TheadElement
            shouldRenderDiv={shouldRenderDiv}
            className={classnames({
              'sticky-container': isStickyHeaderEnabled,
            })}
          >
            <TrElement
              className="table__row table__row--header"
              shouldRenderDiv={shouldRenderDiv}
              style={getResizedRowStyle({
                isFullWidth,
                shouldRenderDiv,
                totalWidth,
              })}
            >
              {columns.map((column, index) => (
                <TableHeader
                  column={column}
                  isLast={index === columns.length - 1}
                  isResizingEnabled={isResizingEnabled}
                  key={column.key}
                  onMouseMove={onMouseMoveHandler(index)}
                  registerWidth={registerWidth}
                  shouldRenderDiv={shouldRenderDiv}
                  widths={widths}
                >
                  {renderHeader
                    ? renderHeader({ column })
                    : defaultRenderHeader({
                        column,
                        externalTableSort,
                        isSortingEnabled,
                        tableSort,
                      })}
                </TableHeader>
              ))}
            </TrElement>
          </TheadElement>
          <TbodyElement shouldRenderDiv={shouldRenderDiv}>
            {tableSort.sortedRows.map((row, rowIndex) => {
              const renderRowProps = {
                columns,
                isFullWidth,
                onRowClickHandler,
                onScrollEnd,
                row,
                rowIndex,
                rowsCount: rows.length,
                shouldRenderDiv,
                totalWidth,
                tableRef,
                widths,
              };
              return renderRow ? (
                renderRow(renderRowProps)
              ) : (
                <TableRow<T>
                  {...renderRowProps}
                  key={row.id || rowIndex}
                  shouldRenderDiv={shouldRenderDiv}
                  totalWidth={totalWidth}
                  widths={widths}
                />
              );
            })}
          </TbodyElement>
        </TableElement>
      )}
    </>
  );
};

Table.defaultProps = defaultProps;

export default Table;
