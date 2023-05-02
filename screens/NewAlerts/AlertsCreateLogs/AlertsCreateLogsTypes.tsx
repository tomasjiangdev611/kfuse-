import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { useAlertsCreateLogs } from '../hooks';

const AlertsCreateLogsTypes = ({
  alertsCreateLogsState,
}: {
  alertsCreateLogsState: ReturnType<typeof useAlertsCreateLogs>;
}): ReactElement => {
  const { logsExplorerType, setLogsExplorerType } = alertsCreateLogsState;
  return (
    <div className="alerts__create__logs__types">
      <button
        className={classNames({
          button: true,
          'alerts__create__logs__types--active': logsExplorerType === 'builder',
        })}
        onClick={() => setLogsExplorerType('builder')}
      >
        Query Builder
      </button>
      <button
        className={classNames({
          button: true,
          'alerts__create__logs__types--active': logsExplorerType === 'logql',
        })}
        onClick={() => setLogsExplorerType('logql')}
      >
        LogQL
      </button>
    </div>
  );
};

export default AlertsCreateLogsTypes;
