import { Table, TooltipTrigger } from 'components';
import { colorsByAlertState, dateTimeFormat } from 'constants';

import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

const columns = [
  {
    key: 'state',
    label: 'State',
    renderCell: ({ row }: { row: any }) => {
      const status = row.state ? row.state.toLowerCase() : '';
      return (
        <div
          className="chip alerts__list__status-chip"
          style={{
            backgroundColor: colorsByAlertState[status]
              ? colorsByAlertState[status]
              : colorsByAlertState['no_data'],
          }}
        >
          {status}
        </div>
      );
    },
  },
  {
    key: 'labels',
    label: 'Labels',
    renderCell: ({ row }: { row: any }) => {
      const newLabels = { ...row.labels };
      delete newLabels.alertname;
      return JSON.stringify(newLabels);
    },
  },
  {
    key: 'value',
    label: 'Value',
  },
  {
    key: 'activeAt',
    label: 'Created At',
    renderCell: ({ row }: { row: any }) => {
      const date = dayjs(row.activeAt);
      if (date.year() > 1970) {
        return date.format(dateTimeFormat);
      }
    },
  },
];

const AlertsDetailsEventsList = ({
  alerts,
}: {
  alerts: Array<any>;
}): ReactElement => {
  return (
    <div className="alerts__details__events-list box-shadow">
      <div className="alerts__details__subheader">
        <TooltipTrigger tooltip="Historical events on this alerts.">
          <h2>Events</h2>
        </TooltipTrigger>
      </div>
      {alerts && (
        <Table
          className="alerts__list__table"
          columns={columns}
          rows={alerts}
        />
      )}
    </div>
  );
};

export default AlertsDetailsEventsList;
