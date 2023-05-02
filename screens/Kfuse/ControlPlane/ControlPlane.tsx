import { Loader } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGrafanaDashboard, getGrafanaDashboardByUid } from 'requests';

import { Dashboard } from '../../Dashboard';
import { getDashboardName } from './utils';
import classNames from 'classnames';

const ControlPlane = (): ReactElement => {
  const [jsonModel, setJsonModel] = React.useState<string>('');
  const [dashboardError, setDashboardError] = React.useState<string>('');

  const grafanaDashboardRequest = useRequest(getGrafanaDashboard);
  const dashboardByUidRequest = useRequest(getGrafanaDashboardByUid);
  const { dashboardName } = useParams();

  const loadDashboardList = async () => {
    setJsonModel(null);
    let dashboardList = [];
    if (grafanaDashboardRequest.result) {
      dashboardList = grafanaDashboardRequest.result;
    } else {
      dashboardList = await grafanaDashboardRequest.call(
        `type=dash-db&folderId=0`,
      );
    }

    const name = getDashboardName(dashboardName);
    const dashboard = dashboardList.find((item: any) => item.title === name);
    if (!dashboard) {
      setDashboardError(`${dashboardName} dashboard not found`);
      return;
    }
    const dashboardJson = await dashboardByUidRequest.call(dashboard.uid);
    setJsonModel(dashboardJson.dashboard);
  };

  useEffect(() => {
    loadDashboardList();
  }, [dashboardName]);

  const isLoading =
    grafanaDashboardRequest.isLoading || dashboardByUidRequest.isLoading;
  return (
    <div
      className={classNames({
        'control-plane--loading': isLoading,
      })}
    >
      {dashboardName === 'hawkeye' && !isLoading && (
        <div className="control-plane__info-banner info">
          Hawkeye monitors services discovered by the “Knight Agent” (learn more
          &nbsp;
          <a href="https://kloudfuse.atlassian.net/wiki/spaces/EX/pages/756056089/Advanced+analytics?src=search#HawkEye">
            here
          </a>
          ) using advance anomaly detection algorithm (based on RRCF) for any
          abnormal behavior.
        </div>
      )}
      <Loader isLoading={isLoading}>
        {jsonModel && (
          <Dashboard
            disableEditPanel={true}
            disableFilter={false}
            jsonModal={jsonModel}
            hideSidebar={true}
          />
        )}
      </Loader>
      {!isLoading && dashboardError && (
        <div className="control-plane__no-dashboard">{dashboardError}</div>
      )}
    </div>
  );
};

export default ControlPlane;
