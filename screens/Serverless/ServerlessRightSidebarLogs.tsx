import { Table } from 'components';
import { serverlessLogsTableColumns } from 'constants';
import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import { getLogs } from 'requests';
import { DateSelection } from 'types';

type Props = {
  date: DateSelection;
  functionName: string;
};

const ServerlessRightSidebarLogs = ({ date, functionName }: Props) => {
  const getLogsRequest = useRequest(getLogs);

  const selectedFacetValues = {
    [`Additional:!:functionname:!:${functionName}`]: 1,
  };

  useEffect(() => {
    getLogsRequest.call({ date, selectedFacetValues });
  }, []);
  return (
    <div className="serverless__right-sidebar__logs">
      <Table
        className="table--bordered-cells table--padded"
        columns={serverlessLogsTableColumns}
        isSortingEnabled
        rows={getLogsRequest.result?.events || []}
      />
    </div>
  );
};

export default ServerlessRightSidebarLogs;
