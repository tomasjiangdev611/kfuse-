import {
  ChipWithLabel,
  TableWithState,
  TableColumnType,
  useColumnsState,
} from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateSelection } from 'types';
import { SidebarState } from './types';

type RenderCellProps = {
  row: any;
  value: any;
};

const getColumns = (colorsByServiceName, onClickHandler) => [
  {
    key: 'serviceName',
    label: 'Service',
    renderCell: ({ value }: RenderCellProps) => (
      <ChipWithLabel
        color={colorsByServiceName[value]}
        label={
          <button className="link" onClick={onClickHandler(value)}>
            {value}
          </button>
        }
      />
    ),
  },
  {
    key: 'spanName',
    label: 'Span',
  },
  {
    key: 'avgSpansPerTrace',
    label: 'Avg Spans per Trace',
    type: TableColumnType.NUMBER,
  },
  {
    key: 'averageDuration',
    label: 'Average Duration',
    type: TableColumnType.NUMBER,
  },
  {
    key: 'errorRateBySpan',
    label: 'Error Rate by Span',
    type: TableColumnType.NUMBER,
  },
  {
    key: 'averagePercentExecutionTime',
    label: 'Avg % Execution Time',
    type: TableColumnType.NUMBER,
  },
];

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  request: ReturnType<typeof useRequest>;
  rows: any[];
  setSidebar: (sidebar: SidebarState) => void;
  spanName: string;
};

const ServiceSidebarSpansTable = ({
  colorsByServiceName,
  date,
  request,
  rows,
  setSidebar,
  spanName,
}: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!request.calledAtLeastOnce) {
      request.call({ date, spanName });
    }
  }, []);

  const onClickHandler = (service: string) => () => {
    navigate(`/apm/services/${service}`);
    setSidebar(null);
  };

  const columns = getColumns(colorsByServiceName, onClickHandler);

  const columnsState = useColumnsState({
    columns,
    initialState: {
      resizedWidths: {},
      selectedColumns: {
        serviceName: 1,
        spanName: 1,
        avgSpansPerTrace: 1,
        averageDuration: 1,
        errorRateBySpan: 1,
        averagePercentExecutionTime: 1,
      },
    },
    key: 'service-sidebar-spans-table',
  });

  return (
    <TableWithState
      className="service__sidebar__spans"
      columnsState={columnsState}
      rows={rows}
    />
  );
};

export default ServiceSidebarSpansTable;
