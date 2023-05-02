import { MutableRefObject, ReactNode } from 'react';

interface RenderCellArgs<T> {
  column: TableColumn<T>;
  row: T;
  tableRef: MutableRefObject<HTMLTableElement | null>;
  value: any;
  wrapText?: boolean;
}

export enum TableColumnType {
  NUMBER = 'number',
}

export interface TableColumn<T> {
  className?: string;
  key: string;
  label: ReactNode;
  renderCell?: ({ row, tableRef, wrapText }: RenderCellArgs<T>) => ReactNode;
  type?: TableColumnType;
  width?: number;
  value?: ({ row }: { row: T }) => any;
}

export interface TableRowProps<T> {
  className?: string;
  columns: TableColumn<T>[];
  isFullWidth?: boolean;
  onMouseEnter?: () => void;
  onRowClickHandler: (row: T) => void;
  onScrollEnd: VoidFunction;
  row: T;
  rowIndex?: number;
  rowsCount: number;
  shouldRenderDiv?: boolean;
  tableRef: MutableRefObject<HTMLTableElement | null>;
  totalWidth?: number;
  widths: TableWidths;
  wrapText?: boolean;
}

export type TableWidths = {
  [key: string]: number;
};
