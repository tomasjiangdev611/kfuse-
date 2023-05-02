import { Loader, Table } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { getGrafanaDashboard } from 'requests';

const columns = [
  { key: 'title', label: 'Analysis Dashboard' },
  { key: 'creationTime', label: 'Creation Time' },
];

const BullseyeDashboards = () => {
  const grafanaDashboardRequest = useRequest(getGrafanaDashboard);

  useEffect(() => {
    grafanaDashboardRequest.call(`type=dash-db&folderId=0`);
  }, []);

  const filteredDashboard = useMemo(() => {
    if (grafanaDashboardRequest.result) {
      return grafanaDashboardRequest.result.filter(
        (item) => item.folderTitle === 'bullseye-reports',
      );
    }
    return [];
  }, [grafanaDashboardRequest.result]);

  return (
    <div>
      {grafanaDashboardRequest.result && (
        <div className="bullseye-dashboards__info-banner info">
          Bullseye automatically analyses alerts raised by Hawkeye by
          correlating across metrics from connected/related services. The
          analysis done by Bullseye is presented here as a report. Learn more
          &nbsp;
          <a href="https://kloudfuse.atlassian.net/wiki/spaces/EX/pages/756056089/Advanced+analytics?src=search#BullsEye">
            here
          </a>
        </div>
      )}
      <div className="bullseye-dashboards">
        <div className="bullseye-dashboards__header">
          Bullseye Analysis Reports
        </div>
        <div className="bullseye-dashboards__list">
          <Loader isLoading={grafanaDashboardRequest.isLoading}>
            <Table
              className="bullseye-dashboards__table"
              columns={columns}
              rows={filteredDashboard}
              onRowClick={({ row }) => {
                window.open(`#/metrics/dashboard/${row.uid}`, '_blank');
              }}
            />
          </Loader>
          {grafanaDashboardRequest.result && filteredDashboard.length === 0 && (
            <div className="bullseye-dashboards__no-dashboard">
              No bullseye dashboards found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullseyeDashboards;
