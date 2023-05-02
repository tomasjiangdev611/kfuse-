import { useDateState, useRequest } from 'hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getGrafanaAlertsByGroup, promqlQueryRange } from 'requests';

import AlertsDetailsEventsList from './AlertsDetailsEventsList';
import AlertsDetailsProperties from './AlertsDetailsProperties';
import { AlertsChart } from '../components';
import { useAlertsState } from '../hooks';
import { ConditionProps, RuleProps } from '../types';
import { getDateFromRange } from 'screens/Dashboard/utils';

const AlertsDetailsSLO = (): ReactElement => {
  const location = useLocation();
  const rule = location.state as RuleProps;

  const [date, setDate] = useDateState();
  const [condition, setCondition] = useState<ConditionProps>({});
  const alertsState = useAlertsState();

  const grafanaAlertsByGroupRequest = useRequest(getGrafanaAlertsByGroup);
  const promqlQueryRangeRequest = useRequest(promqlQueryRange);

  const loadEvaluationGraph = async () => {
    promqlQueryRangeRequest.call({
      date: getDateFromRange('now-5m', 'now'),
      metricNames: [''],
      promqlQueries: [rule.ruleData[0].model.expr],
      type: 'timeseries',
    });
  };

  useEffect(() => {
    grafanaAlertsByGroupRequest.call(rule.group, rule.name);
    loadEvaluationGraph();
  }, []);

  return (
    <div className="alerts__details">
      <AlertsDetailsProperties
        alertsState={alertsState}
        condition={condition}
        promql={rule?.ruleData[0]?.model.expr}
        properties={rule}
        status={rule.status}
      />
      <div className="alerts__details__events-list box-shadow">
        <div className="alerts__details__subheader">
          <h2>Evaluation Graph</h2>
        </div>
        {rule && date && (
          <AlertsChart
            conditionOperator={'last'}
            conditionValue={0}
            date={date}
            isLoading={promqlQueryRangeRequest.isLoading}
            queryData={promqlQueryRangeRequest.result}
          />
        )}
      </div>
      <AlertsDetailsEventsList alerts={grafanaAlertsByGroupRequest.result} />
    </div>
  );
};

export default AlertsDetailsSLO;
