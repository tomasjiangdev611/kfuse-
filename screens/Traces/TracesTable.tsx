import {
  Loader,
  Table,
  TableHeader,
  useColumnsState,
  useTableOptions,
  useTableSearch,
  useTableSort,
} from 'components';
import {
  tracesTableColumns,
  TracesTableColumnKey,
  tracesTableLiveTailColumns,
  TracesTableLiveTailColumnKey,
} from 'constants';
import {
  useLiveTail,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import { DateSelection, SpanFilter, Trace } from 'types';
import useTracesRequest from './useTracesRequest';

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  liveTail: ReturnType<typeof useLiveTail>;
  selectedFacetRangeByNameState: ReturnType<
    typeof useSelectedFacetRangeByNameState
  >;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  setActiveTrace: (trace: Trace) => void;
  spanFilter: SpanFilter;
  traceIdSearch: string;
};

const TracesTable = ({
  colorsByServiceName,
  date,
  liveTail,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  setActiveTrace,
  spanFilter,
  traceIdSearch,
}: Props) => {
  const { service } = useParams();
  const tracesRequest = useTracesRequest({
    date,
    service,
    selectedFacetRangeByNameState,
    selectedFacetValuesByNameState,
    spanFilter,
    traceIdSearch,
  });

  const onRowClick = ({ row }: { row: Trace }) => {
    setActiveTrace(row);
  };

  const regularColumns = tracesTableColumns(colorsByServiceName);
  const regularColumnsState = useColumnsState({
    columns: regularColumns,
    initialState: {
      resizedWidths: {},
      selectedColumns: {
        [TracesTableColumnKey.spanStartTimeNs]: 1,
        [TracesTableColumnKey.spanAttributesServiceName]: 1,
        [TracesTableColumnKey.spanName]: 1,
        [TracesTableColumnKey.duration]: 1,
        [TracesTableColumnKey.spanMethod]: 1,
        [TracesTableColumnKey.spanAttributesStatusCode]: 1,
        [TracesTableColumnKey.spanEndpoint]: 1,
        [TracesTableColumnKey.traceMetrics]: 1,
      },
    },
    key: 'traces-live-table',
  });

  const liveColumns = tracesTableLiveTailColumns(colorsByServiceName);
  const liveColumnsState = useColumnsState({
    columns: liveColumns,
    initialState: {
      resizedWidths: {},
      selectedColumns: {
        [TracesTableLiveTailColumnKey.startTimeNs]: 1,
        [TracesTableLiveTailColumnKey.serviceName]: 1,
        [TracesTableLiveTailColumnKey.name]: 1,
        [TracesTableLiveTailColumnKey.duration]: 1,
        [TracesTableLiveTailColumnKey.method]: 1,
        [TracesTableLiveTailColumnKey.attributesStatusCode]: 1,
        [TracesTableLiveTailColumnKey.endpoint]: 1,
      },
    },
    key: 'traces-live-table',
  });

  const columnsState = liveTail.isEnabled
    ? liveColumnsState
    : regularColumnsState;

  const columns = liveTail.isEnabled ? liveColumns : regularColumns;
  const rows = liveTail.isEnabled ? liveTail.items : tracesRequest.result || [];

  const tableOptions = useTableOptions();
  const tableSearch = useTableSearch({ rows });
  const tableSort = useTableSort({ columns, rows: tableSearch.searchedRows });

  return (
    <>
      <TableHeader
        columnsState={columnsState}
        tableOptions={tableOptions}
        tableSearch={tableSearch}
      />
      <Loader className="traces__table" isLoading={tracesRequest.isLoading}>
        {liveTail.isEnabled ? (
          <Table
            className="table--padded table--bordered-cells"
            columns={columnsState.renderedColumns}
            rows={liveTail.items}
          />
        ) : (
          <Table
            className="table--padded table--bordered-cells"
            columns={regularColumnsState.renderedColumns}
            isSortingEnabled
            onRowClick={onRowClick}
            onScrollEnd={tracesRequest.onScrollEnd}
            rows={tableSort.sortedRows}
          />
        )}
      </Loader>
    </>
  );
};

export default TracesTable;
