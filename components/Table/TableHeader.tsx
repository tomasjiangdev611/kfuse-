import classnames from 'classnames';
import { useMouseMover } from 'hooks';
import React, { ReactElement, ReactNode, useLayoutEffect, useRef } from 'react';
import { ThElement } from './components';
import getResizedCellStyle from './getResizedCellStyle';
import { TableColumn } from './types';

interface Props<T> {
  children: ReactNode;
  column: TableColumn<T>;
  isLast: boolean;
  isResizingEnabled: boolean;
  onMouseMove: (args: unknown) => void;
  shouldRenderDiv: boolean;
  registerWidth: (key: string, width: number) => void;
  widths: { [key: string]: number };
}

const TableHeader = <T,>({
  children,
  column,
  isLast,
  isResizingEnabled,
  onMouseMove,
  registerWidth,
  shouldRenderDiv,
  widths,
}: Props<T>): ReactElement => {
  const { onMouseDown } = useMouseMover({ onMouseMove });
  const ref = useRef<HTMLTableCellElement>();

  useLayoutEffect(() => {
    const shouldRegister = typeof widths[column.key] !== 'number';
    if (isResizingEnabled && shouldRegister) {
      registerWidth(
        column.key,
        column?.width ?? Math.min(ref.current?.offsetWidth ?? 0, 300),
      );
    }
  }, []);

  return (
    <ThElement
      className={classnames({
        table__cell: true,
        'table__cell--header': true,
        [`table__cell--${column.key}`]: true,
        [`table__cell--${column.type}`]: column.type,
      })}
      key={column.key}
      ref={ref}
      shouldRenderDiv={shouldRenderDiv}
      style={getResizedCellStyle({
        isLast,
        shouldRenderDiv,
        width: widths[column.key] || 0,
      })}
    >
      {children}
      <button className="table__cell__handle" onMouseDown={onMouseDown} />
    </ThElement>
  );
};

export default TableHeader;
