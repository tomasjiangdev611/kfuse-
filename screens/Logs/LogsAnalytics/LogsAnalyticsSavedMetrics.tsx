import {
  ConfirmationModal,
  Loader,
  Table,
  useModalsContext,
  useToastmasterContext,
} from 'components';
import React, { ReactElement, useEffect } from 'react';
import { ExternalLink, Trash } from 'react-feather';
import { getMetricsExplorerDefaultQuery } from 'utils';

import { useLogsAnalytics } from './hooks';

const columns = (
  onDelete: (name: string) => void,
  onOpen: (name: string) => void,
) => [
  { label: 'Name', key: 'name' },
  {
    label: 'Labels',
    key: 'labels',
    width: 200,
    renderCell: ({ row }) => {
      if (!row.labels) return '';
      const labelsSplit = row.labels.split(',');
      return labelsSplit.map((label: string, idx: number) =>
        idx === labelsSplit.length - 1 ? label : `${label}, `,
      );
    },
  },
  {
    label: 'Filter',
    key: 'filter',
    renderCell: ({ row }) => {
      if (!row.filter) return '';

      const parsedFilter = JSON.parse(row.filter);
      if (parsedFilter.and) {
        const filterBitmap: { [key: string]: boolean } = {};
        parsedFilter.and.map((filter: any) => {
          if (filter.eq) {
            const key = `${filter.eq.facetName}="${filter.eq.value}"`;
            filterBitmap[key] = true;
          }
        });
        const filterKeys = Object.keys(filterBitmap);
        return filterKeys.map((key: string) => (
          <div key={key} className="chip">
            {key}
          </div>
        ));
      }
      return '';
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

const LogsAnalyticsSavedMetrics = ({
  logsAnalytics,
}: {
  logsAnalytics: ReturnType<typeof useLogsAnalytics>;
}): ReactElement => {
  const modal = useModalsContext();
  const { addToast } = useToastmasterContext();
  const { deleteLogsMetricRequest, savedMetricsRequest } = logsAnalytics;
  const onDeleteMetric = (metricName: string) => {
    modal.push(
      <ConfirmationModal
        className="logs__analytics__saved-metrics__delete-modal"
        description={`Are you sure you want to delete saved metric?`}
        onCancel={() => modal.pop()}
        onConfirm={() => {
          deleteLogsMetricRequest
            .call(metricName)
            .then((deleteMetricResponse: any) => {
              if (deleteMetricResponse) {
                addToast({
                  status: 'success',
                  text: 'Metric deleted successfully.',
                });
                savedMetricsRequest.call();
              }
            });
          modal.pop();
        }}
        title="Delete Metric"
      />,
    );
  };

  const openInMetricsExplorer = (metricName: string) => {
    const defaultQuery = getMetricsExplorerDefaultQuery(metricName);
    const defaultQueryStr = encodeURIComponent(JSON.stringify([defaultQuery]));
    window.open(
      `${window.location.origin}/#/metrics?metricsQueries=${defaultQueryStr}`,
      '_blank',
    );
  };

  useEffect(() => {
    savedMetricsRequest.call();
  }, []);

  return (
    <div className="logs__analytics__saved-metrics">
      <div className="logs__analytics__saved-metrics__header">
        Logs Derived Metrics
      </div>
      <Loader
        isLoading={
          savedMetricsRequest.isLoading || deleteLogsMetricRequest.isLoading
        }
      >
        <Table
          className="logs__analytics__saved-metrics__table"
          columns={columns(onDeleteMetric, openInMetricsExplorer)}
          rows={savedMetricsRequest.result || []}
        />
      </Loader>
    </div>
  );
};

export default LogsAnalyticsSavedMetrics;
