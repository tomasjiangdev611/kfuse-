import { tracesTableColumns, TracesTableColumnKey } from 'constants';
import { Loader, SpanFilters, Table, TableWithState, useColumnsState } from 'components';
import {
  useRequest,
  useSelectedFacetValuesByNameState,
  useSpanFilters,
} from 'hooks';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { traces } from 'requests';
import { DateSelection, Trace } from 'types';
import { SidebarState } from './types';
import { buildSelectedFacetValuesByName } from './utils';

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  formValues: { [key: string]: any };
  name: string;
  property: string;
  service: string;
  setSidebar: (sidebarState: SidebarState) => void;
};

const ServiceSidebarTraces = ({
  colorsByServiceName,
  date,
  formValues,
  name,
  property,
  service,
  setSidebar,
}: Props) => {
  const navigate = useNavigate();

  const viewInTraces = () => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('date', JSON.stringify(date));
    urlSearchParams.set(
      'selectedFacetValuesByName',
      JSON.stringify({
        service_name: {
          [service]: 1,
        },
        [property]: {
          [name]: 1,
        },
      }),
    );

    navigate(`/apm/traces?${urlSearchParams.toString()}`);
  };

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
        [property]: {
          [name]: 1,
        },
        ...selectedFacetValuesByNameState.state,
        ...buildSelectedFacetValuesByName(formValues),
      },
      spanFilter,
    });
  }, [formValues, selectedFacetValuesByNameState.state, spanFilter]);

  const columns = tracesTableColumns(colorsByServiceName).filter(
    (column) => column.key !== 'span.endpoint',
  );
  const rows: Trace[] = tracesRequest.result || [];

  const columnsState = useColumnsState({
    columns,
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
    key: 'service-sidebar-traces-table',
  });

  return (
    <div className="service__sidebar__section">
      <div className="service__sidebar__section__header">
        <div className="service__sidebar__section__header__title">Spans</div>
        <div className="service__sidebar__section__header__actions">
          <div className="service__sidebar__section__header__actions__item">
            <SpanFilters spanFilters={spanFilters} />
          </div>
          <div className="service__sidebar__section__header__actions__item">
            <button className="button" onClick={viewInTraces}>
              View in Traces
            </button>
          </div>
        </div>
      </div>
      <div className="service__sidebar__section__body">
        <div className="service__traces">
          <Loader
            className="service__traces__table"
            isLoading={tracesRequest.isLoading}
          >
            <TableWithState
              columnsState={columnsState}
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
      </div>
    </div>
  );
};

export default ServiceSidebarTraces;
