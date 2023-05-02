import { Loader, Table } from 'components';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { getGrafanaDashboard } from 'requests';

const columns = [
  {
    key: 'title',
    label: 'Title',
  },
];

const ADD_DASHBOARD_DISABLED = true;

const DashboardList = () => {
  const navigate = useNavigate();

  const grafanaDashboardRequest = useRequest(getGrafanaDashboard);

  useEffect(() => {
    grafanaDashboardRequest.call(`type=dash-db&folderId=0`);
  }, []);

  return (
    <div className="dashboard__list">
      <Loader isLoading={grafanaDashboardRequest.isLoading}>
        {!ADD_DASHBOARD_DISABLED && (
          <div className="dashboard__list__header">
            <button
              className="button button--blue"
              onClick={() => navigate('/metrics/dashboard/new')}
            >
              <Plus />
              Add Dashboard
            </button>
          </div>
        )}
        <Table
          className="dashboard__list__table"
          columns={columns}
          rows={grafanaDashboardRequest.result || []}
          onRowClick={({ row }) => navigate(`/metrics/dashboard/${row.uid}`)}
        />
      </Loader>
    </div>
  );
};

export default DashboardList;
