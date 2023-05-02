import classnames from 'classnames';
import SizeObserver from './SizeObserver';
import React from 'react';
import { Table, TableProps } from 'react-fluid-table';

type Props = {
  className?: string;
  tableWidth?: number;
} & TableProps;

const VirtualizedTable = ({ className, tableWidth, ...rest }: Props) => {
  return (
    <SizeObserver className={classnames({ [className]: className })}>
      {({ height, width }) => (
        <Table
          {...rest}
        />
      )}
    </SizeObserver>
  );
};

export default VirtualizedTable;
