import {
  ConfirmationModal,
  Table,
  useModalsContext,
  useToastmasterContext,
} from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { ExternalLink, Trash } from 'react-feather';
import { deleteTraceMetric } from 'requests';
import { SpanFilter } from 'types';
import { getMetricsExplorerDefaultQuery } from 'utils';

const getColumns = ({ onDelete, onOpen }) => [
  { key: 'name', label: 'Name' },
  { key: 'labels', label: 'Labels' },
  {
    key: 'filter',
    label: 'Filter',
    renderCell: ({ value }: { value: string }) => {
      if (!value) return '';

      return <span className="text--pre">{value}</span>;
    },
  },
  { label: 'Range Aggregate', key: 'range_aggregate' },
  { label: 'Facet', key: 'unwrap_facet' },
  {
    label: 'Actions',
    key: 'actions',
    renderCell: ({ row }: { row: { name: string } }) => {
      return (
        <div className="logs__analytics__saved-metrics__table__cell__actions">
          <ExternalLink onClick={() => onOpen(row.name)} size={16} />
          <Trash onClick={() => onDelete(row.name)} size={16} />
        </div>
      );
    },
  },
];

type Props = {
  getSavedTraceMetricsRequest: ReturnType<typeof useRequest>;
  spanFilter: SpanFilter;
  traceIdSearch: string;
};

const TracesSavedMetricsModal = ({
  getSavedTraceMetricsRequest,
  spanFilter,
  traceIdSearch,
}: Props) => {
  const modals = useModalsContext();
  const toastmaster = useToastmasterContext();
  const deleteTraceMetricRequest = useRequest(deleteTraceMetric);

  const onDelete = (name: string) => {
    modals.push(
      <ConfirmationModal
        className="logs__analytics__saved-metrics__delete-modal"
        description={`Are you sure you want to delete saved metric?`}
        onCancel={() => modals.pop()}
        onConfirm={() => {
          deleteTraceMetricRequest
            .call(name)
            .then((deleteMetricResponse: any) => {
              if (deleteMetricResponse) {
                toastmaster.addToast({
                  status: 'success',
                  text: 'Metric deleted successfully.',
                });
                getSavedTraceMetricsRequest.call();
              }
            });
          modals.pop();
        }}
        title="Delete Metric"
      />,
    );
  };

  const onOpen = (metricName: string) => {
    const defaultQuery = getMetricsExplorerDefaultQuery(metricName);
    const defaultQueryStr = encodeURIComponent(JSON.stringify([defaultQuery]));
    window.open(
      `${window.location.origin}/#/metrics?metricsQueries=${defaultQueryStr}`,
      '_blank',
    );
  };

  useEffect(() => {
    getSavedTraceMetricsRequest.call();
  }, []);

  const rows = getSavedTraceMetricsRequest.result || [];

  if (rows.length) {
    return (
      <div className="traces__timeseries__saved-metrics">
        <div className="traces__timeseries__saved-metrics__header">
          Saved trace metrics
        </div>
        <div className="traces__timeseries__saved-metrics__table">
          <Table
            className="table--padded table--bordered table--bordered-cells"
            columns={getColumns({ onDelete, onOpen })}
            rows={rows}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default TracesSavedMetricsModal;
