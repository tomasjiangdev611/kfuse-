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
import { useSelectedFacetValuesByNameState } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { DateSelection } from 'types';
import { KpisByServiceName } from './types';
import useKpisByServiceNameRequest from './useKpisByServiceNameRequest';

const getRows = (kpisByServiceName) => {
  return Object.keys(kpisByServiceName).map((serviceName) => ({
    name: serviceName,
    ...kpisByServiceName[serviceName],
  }));
};

type Props = {
  columnsState: ReturnType<typeof useColumnsState>;
  date: DateSelection;
  kpisByServiceName: KpisByServiceName;
  kpisByServiceNameRequest: ReturnType<typeof useKpisByServiceNameRequest>;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
};

const ServicesTable = ({
  columnsState,
  date,
  kpisByServiceName,
  kpisByServiceNameRequest,
  selectedFacetValuesByNameState,
}: Props) => {
  const { columns } = columnsState;
  const rows = useMemo(() => getRows(kpisByServiceName), [kpisByServiceName]);

  const tableOptions = useTableOptions();
  const tableSearch = useTableSearch({ rows });
  const tableSort = useTableSort({ columns, rows: tableSearch.searchedRows });
  const paginator = usePaginator({ rows: tableSort.sortedRows });

  useEffect(() => {
    if (columnsState.isReady) {
      kpisByServiceNameRequest.call({
        columns,
        date,
        selectedColumns: columnsState.state.selectedColumns,
        selectedFacetValuesByName: selectedFacetValuesByNameState.state,
      });
    }
  }, [date, columnsState.isReady, selectedFacetValuesByNameState.state]);

  return (
    <div>
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
      />
      <div className="table-footer">
        <Paginator paginator={paginator} />
      </div>
    </div>
  );
};

export default ServicesTable;
