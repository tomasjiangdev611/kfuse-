import { Table } from 'components';
import dayjs from 'dayjs';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlertRules } from 'requests';

const columns = [
  {
    key: 'state',
    label: 'State',
  },
  { key: 'name', label: 'Name' },
  {
    key: 'health',
    label: 'Health',
  },
  {
    key: 'lastEvaluation',
    label: 'Last Evaluated',
    renderCell: ({ row }) => dayjs(row.lastEvaluation).fromNow(),
  },
];

const Alerts = () => {
  const navigate = useNavigate();
  const getAlertsRequest = useRequest(getAlertRules);
  const alertRules = (getAlertsRequest.result?.data.groups || []).reduce(
    (arr, alertGroup) => [...arr, ...alertGroup.rules],
    [],
  );

  const navigateToAlertNewRule = () => {
    navigate('/alerts/new-rule');
  };

  useEffect(() => {
    getAlertsRequest.call();
  }, []);

  return (
    <div className="alerts">
      <button
        className="button button--primary"
        onClick={navigateToAlertNewRule}
      >
        New Rule
      </button>
      <Table columns={columns} rows={alertRules} />
    </div>
  );
};

export default Alerts;
