import { Stepper } from 'components';
import { useLogsMetricsQueryBuilderState, useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  getLogMetricsTimeseriesMultiple,
  getLogMetricsTimeSeriesLogQL,
} from 'requests';

import AlertsCreateLogsLogQL from './AlertsCreateLogsLogQL';
import AlertsCreateLogsQueryBuilder from './AlertsCreateLogsQueryBuilder';
import AlertsCreateLogsTypes from './AlertsCreateLogsTypes';
import {
  AlertsChart,
  AlertsCreateConditions,
  AlertsCreateContacts,
  AlertsCreateDetails,
  AlertsCreateEvaluate,
  CreateRuleButton,
} from '../components';
import {
  useAlertsCreate,
  useAlertsCreateConditions,
  useAlertsCreateLogs,
} from '../hooks';
import { RuleProps } from '../types';
import { getRulePromqlAndConditions } from '../utils';

const AlertsCreateLogs = ({
  baseWidth,
  alertsCreateState,
  conditionsState,
}: {
  baseWidth: number;
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
}): ReactElement => {
  const [params] = useSearchParams();
  const location = useLocation();
  const rule = location.state as RuleProps;

  const logMetricsTimeseriesMultipleRequest = useRequest(
    getLogMetricsTimeseriesMultiple,
  );
  const logMetricsTimeSeriesLogQLRequest = useRequest(
    getLogMetricsTimeSeriesLogQL,
  );
  const { date, setUpdateAlertsRuleState } = alertsCreateState;
  const logsMetricsQueryBuilderState = useLogsMetricsQueryBuilderState(date);
  const alertsCreateLogsState = useAlertsCreateLogs(alertsCreateState);

  const { queries } = logsMetricsQueryBuilderState;
  const { conditions, setUpdateConditionState } = conditionsState;
  const {
    createLogQLAlertsRule,
    createLogsAlertsRule,
    logsExplorerType,
    logQLText,
    updateLogQLAndType,
    setSavedMetricName,
  } = alertsCreateLogsState;

  useEffect(() => {
    if (rule) {
      const { promqls, newConditions } = getRulePromqlAndConditions(
        rule.ruleData,
      );
      setUpdateAlertsRuleState(rule);
      setSavedMetricName(promqls[0]);
      setUpdateConditionState(newConditions);

      if (params.get('logQL')) {
        updateLogQLAndType(promqls[0], 'logql');
        logMetricsTimeSeriesLogQLRequest.call({
          logQL: promqls[0],
          date,
          width: baseWidth === 0 ? 1200 : baseWidth - 160,
        });
      }
    }
  }, [rule]);

  const dataRequest =
    logsExplorerType === 'logql'
      ? logMetricsTimeSeriesLogQLRequest
      : logMetricsTimeseriesMultipleRequest;
  return (
    <div className="alerts__create__logs">
      <div className="alerts__create__logs__chart">
        <AlertsChart
          conditionOperator={conditions[0].of}
          conditionValue={Number(conditions[0].value)}
          date={date}
          isLoading={dataRequest.isLoading}
          queryData={dataRequest.result}
        />
      </div>
      <Stepper
        steps={[
          {
            title: 'Pick log metric',
            component: (
              <div>
                <AlertsCreateLogsTypes
                  alertsCreateLogsState={alertsCreateLogsState}
                />
                {logsExplorerType === 'logql' ? (
                  <AlertsCreateLogsLogQL
                    alertsCreateLogsState={alertsCreateLogsState}
                    date={date}
                    logMetricsTimeSeriesLogQLRequest={
                      logMetricsTimeSeriesLogQLRequest
                    }
                    baseWidth={baseWidth}
                  />
                ) : (
                  <AlertsCreateLogsQueryBuilder
                    alertsCreateLogsState={alertsCreateLogsState}
                    date={date}
                    logsMetricsQueryBuilderState={logsMetricsQueryBuilderState}
                    logMetricsTimeseriesMultipleRequest={
                      logMetricsTimeseriesMultipleRequest
                    }
                  />
                )}
              </div>
            ),
          },
          {
            title: 'Set Condition & Evaluate',
            component: (
              <>
                <AlertsCreateConditions
                  ruleType={alertsCreateState.alertType.value}
                  conditionsState={conditionsState}
                  queryAndFormulaKeysLabel={[]}
                />
                <AlertsCreateEvaluate alertsCreateState={alertsCreateState} />
              </>
            ),
          },
          {
            title: 'Add Details',
            component: (
              <AlertsCreateDetails alertsCreateState={alertsCreateState} />
            ),
          },
          {
            title: 'Add Contacts',
            component: (
              <AlertsCreateContacts alertsCreateState={alertsCreateState} />
            ),
          },
        ]}
      />
      <CreateRuleButton
        isEditing={alertsCreateState.isEditing}
        onClick={() => {
          if (logsExplorerType === 'logql') {
            createLogQLAlertsRule(conditions[0], logQLText);
          } else {
            createLogsAlertsRule(conditions[0], queries[0]);
          }
        }}
      />
    </div>
  );
};

export default AlertsCreateLogs;
