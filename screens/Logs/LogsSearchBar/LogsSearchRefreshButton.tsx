import React, { ReactElement } from 'react';
import { RefreshCw } from 'react-feather';
import { refreshDate } from 'utils/refreshDate';

import { useLogsState } from '../hooks';

const LogsSearchRefreshButton = ({
  logsState,
}: {
  logsState: ReturnType<typeof useLogsState>;
}): ReactElement => {
  const { date, setDate } = logsState;

  return (
    <button
      className="logs__search__refresh-button"
      onClick={() => refreshDate(date, setDate)}
      onKeyPress={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <RefreshCw size={14} />
    </button>
  );
};

export default LogsSearchRefreshButton;
