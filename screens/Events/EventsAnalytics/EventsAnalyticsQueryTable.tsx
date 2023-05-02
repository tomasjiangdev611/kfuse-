import { Table } from 'components/Table';
import { useRequest } from 'hooks';
import React, { ReactElement, useMemo } from 'react';

import { eventsCoreLabels } from '../utils';

const getColumns = (groupBy: string[]) => {
  const columns = [];
  groupBy.forEach((key) => {
    if (key === '*') {
      columns.push({ key: 'label', label: 'Label' });
      return;
    }

    const isCoreLabel = eventsCoreLabels.find((e) => e.name === key);
    columns.push({ key, label: isCoreLabel ? isCoreLabel.label : key });
  });

  columns.push({ key: 'count', label: 'Count' });
  return columns;
};

const EventsAnalyticsQueryTable = ({
  eventStackedCountsRequest,
  groupBy,
}: {
  eventStackedCountsRequest: ReturnType<typeof useRequest>;
  groupBy: string[];
}): ReactElement => {
  const tableData = useMemo(() => {
    const data = eventStackedCountsRequest.result;
    if (!data || data.series) return [];

    const newData: Array<{ [key: string]: string }> = [];
    data.forEach(({ count, label }: { count: string; label: string }) => {
      const splitLabel = label.split(', ');
      const newLabels: { [key: string]: string } = {};
      groupBy.forEach((key, i) => {
        if (key === '*') {
          newLabels['label'] = splitLabel[i];
        }
        newLabels[key] = splitLabel[i];
      });

      newData.push({ ...newLabels, count });
    });

    return newData;
  }, [eventStackedCountsRequest.result]);

  return (
    <div className="events__analytics__query__table">
      <Table
        className="events__analytics__query__table__table"
        columns={getColumns(groupBy)}
        rows={tableData}
      />
    </div>
  );
};

export default EventsAnalyticsQueryTable;
