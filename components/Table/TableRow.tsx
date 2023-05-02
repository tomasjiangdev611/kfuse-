import classnames from 'classnames';
import React, { ReactElement, useEffect } from 'react';
import { InView, useInView } from 'react-intersection-observer';
import { TdElement, TrElement } from './components';
import getResizedCellStyle from './getResizedCellStyle';
import getResizedRowStyle from './getResizedRowStyle';
import getValue from './getValue';
import { TableRowProps } from './types';

const TableRow = <T extends { id?: string; [key: string]: unknown }>({
  className,
  columns,
  isFullWidth,
  onMouseEnter,
  onRowClickHandler,
  onScrollEnd,
  row,
  rowIndex,
  rowsCount,
  shouldRenderDiv,
  tableRef,
  totalWidth,
  widths,
  wrapText,
}: TableRowProps<T>): ReactElement => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const onChange = (inView) => {
    if (inView && rowIndex === rowsCount - 5) {
      if (onScrollEnd) {
        onScrollEnd();
      }
    }
  };

  return (
    <InView
      as="tr"
      className={classnames({
        table__row: true,
        'table__row--body': true,
        [className]: className,
      })}
      key={row.id}
      onChange={onChange}
      onClick={onRowClickHandler(row)}
      shouldRenderDiv={shouldRenderDiv}
      style={getResizedRowStyle({ isFullWidth, shouldRenderDiv, totalWidth })}
      {...(onMouseEnter ? { onMouseEnter } : {})}
    >
      {columns.map((column, index) => (
        <TdElement
          className={classnames({
            table__cell: true,
            'table__cell--body': true,
            [`table__cell--${column.key.replace(/\./g, '-')}`]: true,
            [`table__cell--${column.type}`]: column.type,
          })}
          key={column.key}
          shouldRenderDiv={shouldRenderDiv}
          style={getResizedCellStyle({
            isLast: index === columns.length - 1,
            shouldRenderDiv,
            width: widths[column.key],
          })}
        >
          {column.renderCell
            ? column.renderCell({
                column,
                row,
                rowIndex,
                tableRef,
                wrapText,
                value: getValue({ column, row }),
              })
            : getValue({ column, row })}
        </TdElement>
      ))}
    </InView>
  );
};

export default TableRow;
