import { tracesTableColumns } from 'constants';
import { Loader, SpanFilters, Table } from 'components';
import {
  useRequest,
  useSelectedFacetValuesByNameState,
  useSpanFilters,
} from 'hooks';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { traces } from 'requests';
import { DateSelection, Trace } from 'types';
import { SidebarState } from './types';
import { buildSelectedFacetValuesByName } from './utils';

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  service: string;
  setSidebar: Dispatch<SetStateAction<SidebarState>>;
};

const ServiceTraces = ({
  colorsByServiceName,
  date,
  formValues,
  service,
  setSidebar,
}: Props) => {
  const tracesRequest = useRequest(traces);
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const spanFilters = useSpanFilters(selectedFacetValuesByNameState);
  const { spanFilter } = spanFilters;

  useEffect(() => {
    tracesRequest.call({
      date,
      selectedFacetValuesByName: {
        service_name: {
          [service]: 1,
        },
        ...selectedFacetValuesByNameState.state,
        ...buildSelectedFacetValuesByName(formValues),
      },
      spanFilter,
    });
  }, [formValues, selectedFacetValuesByNameState.state, spanFilter]);

  const rows: Trace[] = tracesRequest.result || [];

  return (
    <div className="service__traces">
      <div className="service__traces__header">
        <SpanFilters spanFilters={spanFilters} />
      </div>
      <Loader
        className="service__traces__table"
        isLoading={tracesRequest.isLoading}
      >
        <Table
          className="table--padded table--bordered table--bordered-cells"
          columns={tracesTableColumns(colorsByServiceName).filter(
            (column) => column.key !== 'span.endpoint',
          )}
          isSortingEnabled
          onRowClick={({ row }) => {
            setSidebar((prevSidebar) => {
              const nextPrevSidebar = prevSidebar ? { ...prevSidebar } : {};
              nextPrevSidebar.activeTrace = row;
              return nextPrevSidebar;
            });
          }}
          rows={rows}
        />
      </Loader>
    </div>
  );
};

export default ServiceTraces;
