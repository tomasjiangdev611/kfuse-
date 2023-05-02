import { useDateState, useRequest } from 'hooks';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getDatasources,
  getGrafanaAlertsByGroup,
  getLogMetricsTimeSeriesLogQL,
  promqlQueryRange,
} from 'requests';

import AlertsDetailsEventsList from './AlertsDetailsEventsList';
import AlertsDetailsProperties from './AlertsDetailsProperties';
import { AlertsChart } from '../components';
import { useAlertsState } from '../hooks';
import { ConditionProps, RuleProps } from '../types';
import { getDateForQuery, getRulePromqlAndConditions } from '../utils';

const AlertsDetails = (): ReactElement => {
  const location = useLocation();
  const rule = location.state as RuleProps;

  const [date, setDate] = useDateState();
  const [datasource, setDatasource] = useState(null);
  const [condition, setCondition] = useState<ConditionProps>({});
  const alertsState = useAlertsState();

  const getDatasourcesRequest = useRequest(getDatasources);
  const grafanaAlertsByGroupRequest = useRequest(getGrafanaAlertsByGroup);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);
  const logMetricsTimeSeriesLogQLRequest = useRequest(
    getLogMetricsTimeSeriesLogQL,
  );

  const { newConditions, promqls } = useMemo(() => {
    const { newConditions, promqls, relativeTimeRange } =
      getRulePromqlAndConditions(rule.ruleData);
    const newDate = getDateForQuery(relativeTimeRange);
    setDate(newDate);
    return { newConditions, promqls };
  }, [rule]);

  const loadEvaluationGraph = async () => {
    const result = await getDatasourcesRequest.call();
    const datasource = result.find(
      (data) =>
        data.uid === rule.datasourceUid || data.name === rule.datasourceUid,
    );
    setDatasource(datasource);

    if (datasource) {
      if (datasource.type === 'prometheus') {
        setCondition(newConditions[0]);
        promqlQueryRangeRequest.call({
          date,
          metricNames: [''],
          promqlQueries: promqls,
          type: 'timeseries',
        });
      } else if (datasource.type === 'loki') {
        logMetricsTimeSeriesLogQLRequest.call({
          date,
          logQL: promqls[0],
          width: document.body.clientWidth - 140,
        });
      }
    }
  };

  useEffect(() => {
    grafanaAlertsByGroupRequest.call(rule.group, rule.name);
    loadEvaluationGraph();
  }, [promqls, newConditions]);

  const dataRequest =
    datasource?.type === 'loki'
      ? logMetricsTimeSeriesLogQLRequest
      : promqlQueryRangeRequest;

  return (
    <div className="alerts__details">
      <AlertsDetailsProperties
        alertsState={alertsState}
        condition={condition}
        promql={promqls[0]}
        properties={rule}
        status={rule.status}
      />
      <div className="alerts__details__events-list box-shadow">
        <div className="alerts__details__subheader">
          <h2>Evaluation Graph</h2>
        </div>
        {rule && date && (
          <AlertsChart
            conditionOperator={newConditions[0].of}
            conditionValue={Number(newConditions[0].value)}
            date={date}
            isLoading={dataRequest.isLoading || getDatasourcesRequest.isLoading}
            queryData={dataRequest.result}
          />
        )}
      </div>

      <AlertsDetailsEventsList alerts={grafanaAlertsByGroupRequest.result} />
    </div>
  );
};

export default AlertsDetails;
