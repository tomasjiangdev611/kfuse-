import { Loader, SizeObserver } from 'components';
import { Datepicker } from 'composite';
import React, { useEffect } from 'react';
import { useAlertsCreate, useAlertsCreateConditions } from '../hooks';
import { AlertsCreateLogs } from '../AlertsCreateLogs';
import { AlertsCreateMetrics } from '../AlertsCreateMetrics';
import AlertsCreateSLO from './AlertsCreateSLO';

const AlertsCreate = () => {
  const conditionsState = useAlertsCreateConditions();
  const alertsCreateState = useAlertsCreate();
  const {
    isEditing,
    isSaving,
    absoluteTimeRangeStorage,
    alertType,
    date,
    getGrafanaAlertsFoldersRequest,
    setDate,
  } = alertsCreateState;

  useEffect(() => {
    getGrafanaAlertsFoldersRequest.call();
  }, []);

  const getAlertEditHeading = () => {
    const editOrCreate = isEditing ? 'Edit' : 'Create';
    if (alertType.value === 'metrics') {
      return `${editOrCreate} Metric Alert`;
    }
    if (alertType.value === 'logs') {
      return `${editOrCreate} Log Alert`;
    }
    if (alertType.value === 'slo') {
      return `${editOrCreate} SLO Alert`;
    }
    return '';
  };

  return (
    <div className="alerts__create">
      <SizeObserver>
        {({ width: baseWidth }) => (
          <Loader isLoading={isSaving}>
            <div className="alerts__create__header">
              <h2>{getAlertEditHeading()}</h2>
              <div className="alerts__create__datepicker">
                <Datepicker
                  absoluteTimeRangeStorage={absoluteTimeRangeStorage}
                  className="logs__search__datepicker"
                  hasStartedLiveTail={false}
                  onChange={setDate}
                  startLiveTail={null}
                  value={date}
                />
              </div>
            </div>
            {alertsCreateState.alertType.value === 'metrics' && (
              <AlertsCreateMetrics
                alertsCreateState={alertsCreateState}
                conditionsState={conditionsState}
              />
            )}
            {alertsCreateState.alertType.value === 'logs' && (
              <AlertsCreateLogs
                alertsCreateState={alertsCreateState}
                conditionsState={conditionsState}
                baseWidth={baseWidth}
              />
            )}
            {alertsCreateState.alertType.value === 'slo' && (
              <AlertsCreateSLO
                alertsCreateState={alertsCreateState}
                conditionsState={conditionsState}
              />
            )}
          </Loader>
        )}
      </SizeObserver>
    </div>
  );
};

export default AlertsCreate;
