import React from 'react';
import {
  TableOptionsPopover,
  useColumnsState,
  useTableOptions,
} from './TableOptionsPopover';
import { TableSearch, useTableSearch } from './TableSearch';

type Props = {
  columnsState: ReturnType<typeof useColumnsState>;
  tableOptions: ReturnType<typeof useTableOptions>;
  tableSearch: ReturnType<typeof useTableSearch>;
};

const TableHeader = ({ columnsState, tableOptions, tableSearch }: Props) => {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar__left">
        <TableOptionsPopover
          columnsState={columnsState}
          shouldHideLinesToShow
          tableOptions={tableOptions}
        />
      </div>
      <TableSearch tableSearch={tableSearch} />
    </div>
  );
};

export default TableHeader;
