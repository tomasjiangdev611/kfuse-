import classnames from 'classnames';
import {
  Paginator,
  Table,
  TableOptionsPopover,
  TableSearch,
  useColumnsState,
  usePaginator,
  useTableOptions,
  useTableSearch,
  useTableSort,
} from 'components';
import React from 'react';

type Props = {
  className?: string;
  columnsState: ReturnType<typeof useColumnsState>;
  hideFooter?: boolean;
  onRowClick?: ({ row }) => void;
  onScrollEnd?: VoidFunction;
  rows: any[];
};

const TableWithState = ({
  className,
  columnsState,
  hideFooter,
  rows,
  ...rest
}: Props) => {
  const { columns } = columnsState;
  const tableOptions = useTableOptions();
  const tableSearch = useTableSearch({ rows });
  const tableSort = useTableSort({ columns, rows: tableSearch.searchedRows });
  const paginator = usePaginator({ rows: tableSort.sortedRows });

  return (
    <div className={classnames({ [className]: className })}>
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
      <Table
        className="table--bordered table--padded"
        columns={columns.filter(
          (column) => columnsState.state.selectedColumns[column.key],
        )}
        externalTableSort={tableSort}
        isSortingEnabled
        rows={paginator.paginatedRows}
        {...rest}
      />
      {hideFooter ? null : (
        <div className="table-footer">
          <Paginator paginator={paginator} />
        </div>
      )}
    </div>
  );
};

export default TableWithState;
