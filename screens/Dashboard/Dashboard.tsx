import Loader from 'components/Loader';
import SizeObserver from 'components/SizeObserver';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGrafanaDashboardByUid } from 'requests';

import DashboardFilter from './DashboardFilter';
import DashboardHeader from './DashboardHeader';
import DashboardPanelRender from './DashboardPanelRender';
import DashboardSidebar from './DashboardSidebar';
import { useDashboardState, useDashboardTemplateState } from './hooks';
import { getDateFromRange } from './utils';

const Dashboard = ({
  disableEditPanel = true,
  disableFilter = false,
  jsonModal,
  hideSidebar = true,
  uid,
}: {
  disableEditPanel?: boolean;
  disableFilter?: boolean;
  jsonModal?: any;
  hideSidebar?: boolean;
  uid?: string;
}): ReactElement => {
  const dashboardByUidRequest = useRequest(getGrafanaDashboardByUid);
  const { dashboardId } = useParams();
  const dashboardState = useDashboardState();
  const {
    date,
    initialDashboardSetup,
    isRightSidebarOpenToggle,
    onDateChange,
    panels,
    setPanels,
    setDashboardDetails,
  } = dashboardState;

  const dashboardTemplateState = useDashboardTemplateState(date);
  const { initialTemplateSetup } = dashboardTemplateState;

  const init = (json: any) => {
    const { time } = json;
    onDateChange(getDateFromRange(time.from, time.to));
    initialTemplateSetup(json).then(() => {
      initialDashboardSetup(json);
    });
  };

  useEffect(() => {
    setPanels([]);
    if (dashboardId === 'new') {
      isRightSidebarOpenToggle.on();
    } else if (jsonModal) {
      init(jsonModal);
      setDashboardDetails({ title: jsonModal.title });
    } else if (uid) {
      dashboardByUidRequest.call(uid).then((result) => {
        init(result.dashboard);
      });
    } else {
      dashboardByUidRequest.call(dashboardId).then((result) => {
        init(result.dashboard);
      });
    }
  }, [jsonModal]);

  return (
    <div className="dashboard">
      <SizeObserver>
        {({ height: baseHeight, width: baseWidth }) => (
          <>
            <div className="dashboard__header--sticky">
              <DashboardHeader
                dashboardState={dashboardState}
                hideSidebar={hideSidebar}
              />
              {!disableFilter && (
                <DashboardFilter
                  dashboardState={dashboardState}
                  dashboardTemplateState={dashboardTemplateState}
                />
              )}
            </div>
            {!hideSidebar && (
              <DashboardSidebar dashboardState={dashboardState} />
            )}
            <Loader
              className="dashboard__body"
              isLoading={dashboardByUidRequest.isLoading}
            >
              <DashboardPanelRender
                baseHeight={baseHeight}
                baseWidth={baseWidth}
                dashboardState={dashboardState}
                dashboardTemplateState={dashboardTemplateState}
                disableEditPanel={disableEditPanel}
                nestedIndex={null}
                panels={panels}
              />
            </Loader>
          </>
        )}
      </SizeObserver>
    </div>
  );
};

export default Dashboard;
