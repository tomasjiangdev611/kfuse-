import classNames from 'classnames';
import { AutocompleteV2, Input, Loader } from 'components';
import React, { ReactElement } from 'react';
import { X } from 'react-feather';
import { DateSelection } from 'types/DateSelection';

import { useLogsAnalyticsDashboard } from './hooks';

const LogsAnalyticsExportDashboard = ({
  closeModal,
  date,
  expr,
}: {
  closeModal: () => void;
  date: DateSelection;
  expr: string;
}): ReactElement => {
  const logsAnalyticsDashboard = useLogsAnalyticsDashboard(
    closeModal,
    date,
    expr,
  );
  const {
    dashboardExportType,
    dashboardDetails,
    existingDashboards,
    grafanaDatasourceRequest,
    grafanaDashboardMutateRequest,
    grafanaDashboardByUidRequest,
    onExportDashboard,
    selectedDashboard,
    setDashboardExportType,
    setDashboardDetails,
    setSelectedDashboard,
  } = logsAnalyticsDashboard;

  return (
    <div className="logs__analytics__export-dashboard">
      <div className="logs__analytics__export-dashboard__header">
        <div className="logs__analytics__export-dashboard__header__title">
          Add panel to dashboard
        </div>
        <div
          className="logs__analytics__export-dashboard__header__close"
          onClick={closeModal}
        >
          <X />
        </div>
      </div>
      <Loader
        isLoading={
          grafanaDatasourceRequest.isLoading ||
          grafanaDashboardMutateRequest.isLoading ||
          grafanaDashboardByUidRequest.isLoading
        }
      >
        <div className="logs__analytics__export-dashboard__label">
          Choose where to add the panel
        </div>
        <div className="logs__analytics__export-dashboard__select-type">
          <button
            className={classNames({
              button: true,
              'logs__analytics__export-dashboard__select-type--selected':
                dashboardExportType === 'new',
            })}
            onClick={() => setDashboardExportType('new')}
          >
            New Dashboard
          </button>
          <button
            className={classNames({
              button: true,
              'logs__analytics__export-dashboard__select-type--selected':
                dashboardExportType === 'existing',
            })}
            onClick={() => setDashboardExportType('existing')}
          >
            Existing Dashboard
          </button>
        </div>
        <div>
          {dashboardExportType === 'new' && (
            <>
              <div className="logs__analytics__export-dashboard__label">
                Enter the name of the new dashboard.
              </div>
              <Input
                onChange={(val) =>
                  setDashboardDetails({ ...dashboardDetails, title: val })
                }
                placeholder="Give dashboard a name"
                type="text"
                value={dashboardDetails.title}
              />
            </>
          )}
        </div>
        <div className="logs__analytics__export-dashboard__select-dashboard">
          {dashboardExportType === 'existing' && (
            <>
              <div className="logs__analytics__export-dashboard__label">
                Select in which dashboard the panel will be created.
              </div>
              <AutocompleteV2
                options={existingDashboards}
                onChange={(val) => setSelectedDashboard(val)}
                placeholder="Select existing dashboard"
                value={selectedDashboard}
              />
            </>
          )}
        </div>
        <div>
          <div className="logs__analytics__export-dashboard__label">
            Enter the panel name for chart
          </div>
          <Input
            onChange={(val) =>
              setDashboardDetails({ ...dashboardDetails, panelName: val })
            }
            placeholder="Give chart a panel name"
            type="text"
            value={dashboardDetails.panelName}
          />
        </div>
        <div className="logs__analytics__export-dashboard__footer">
          <button className="button button--red" onClick={closeModal}>
            Cancel
          </button>
          <button className="button button--blue" onClick={onExportDashboard}>
            Export
          </button>
        </div>
      </Loader>
    </div>
  );
};

export default LogsAnalyticsExportDashboard;
