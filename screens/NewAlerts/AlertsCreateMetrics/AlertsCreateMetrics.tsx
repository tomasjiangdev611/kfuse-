import { MetricsQueryBuilder, Stepper } from 'components';
import { useMetricsQueryStateV2 } from 'hooks';
import React, { ReactElement, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { combineQueriesData, convertFromAndToDate } from 'utils';

import AlertsCreateAnomalyBasicCondition from './AlertsCreateAnomalyBasicCondition';
import AlertsCreateAnomalyCondition from './AlertsCreateAnomalyCondition';
import AlertsCreateMetricsDetection from './AlertsCreateMetricsDetection';
import AlertsCreateMetricsChangeCondition from './AlertsCreateMetricsChangeCondition';
import AlertCreateMetricsOutlierCondition from './AlertCreateMetricsOutlierCondition';
import AlertsCreateAnomalyRRCFCondition from './AlertsCreateAnomalyRRCFCondition';
import {
  AlertsAnomalyEvaluate,
  AlertsChart,
  AlertsCreateContacts,
  AlertsCreateConditions,
  AlertsCreateDetails,
  AlertsCreateEvaluate,
  CreateRuleButton,
} from '../components';
import {
  useAlertsCreate,
  useAlertsCreateConditions,
  useAlertsCreateMetrics,
} from '../hooks';
import { RuleProps } from '../types';
import {
  getQueryAndFormulaKeysLabel,
  parseAlertsQueryAndConditions,
} from '../utils';

const AlertsCreateMetrics = ({
  alertsCreateState,
  conditionsState,
}: {
  alertsCreateState: ReturnType<typeof useAlertsCreate>;
  conditionsState: ReturnType<typeof useAlertsCreateConditions>;
}): ReactElement => {
  const location = useLocation();
  const rule = location.state as RuleProps;

  const {
    appendPromqlForChart,
    alertType,
    createAnomalyDetectionRule,
    createChangeAlertsRule,
    createThresoldAlertsRule,
    createOutlierAlertsRule,
    setAlertType,
    setChangeAndOutlierConditions,
  } = useAlertsCreateMetrics(alertsCreateState, conditionsState);

  const {
    conditions,
    metricsChangeCondition,
    outlierCondition,
    anomalyCondition,
    setUpdateConditionState,
  } = conditionsState;

  const metricsQueryState = useMetricsQueryStateV2({
    date: alertsCreateState.date,
    preReloadQuery: (promql, metricName) =>
      appendPromqlForChart(promql, metricName),
  });

  const {
    alertType: ruleType,
    date,
    setUpdateAlertsRuleState,
  } = alertsCreateState;

  const {
    callMultiplePromqlQueries,
    callSeriesQuery,
    formulas,
    queries,
    queryData,
    setFormulas,
    setQueries,
  } = metricsQueryState;

  useEffect(() => {
    if (rule) {
      const newAlertType = rule.annotations?.alertType || 'threshold';
      setAlertType(newAlertType);

      const parsed = parseAlertsQueryAndConditions(rule.ruleData, newAlertType);

      if (newAlertType === 'change' || newAlertType === 'outliers') {
        setChangeAndOutlierConditions(
          newAlertType,
          parsed.changeCondition,
          parsed.outlierCondition,
          parsed.relativeTimeRange,
        );
      }
      const { from, to } = parsed.relativeTimeRange;
      alertsCreateState.setDate(convertFromAndToDate(from, to));

      setQueries(parsed.queries);
      parsed.queries.forEach((query, idx: number) => {
        callSeriesQuery(idx, query.metric);
      });
      if (parsed.formulas.length > 0) {
        setFormulas(parsed.formulas);
      }

      setUpdateAlertsRuleState(rule);
      setUpdateConditionState(parsed.conditions);

      if (parsed.queries.length > 0) {
        callMultiplePromqlQueries(parsed.queries, parsed.formulas);
      }
    }

    return () => {
      setQueries([]);
      setFormulas([]);
    };
  }, []);

  useEffect(() => {
    callMultiplePromqlQueries(queries, formulas);
  }, [alertType, outlierCondition, metricsChangeCondition, anomalyCondition]);

  const combinedData = useMemo(() => {
    return combineQueriesData(formulas, queries, queryData);
  }, [queryData]);

  return (
    <div>
      <AlertsChart
        conditionOperator={conditions[0].of}
        conditionValue={Number(conditions[0].value)}
        date={date}
        isLoading={combinedData.isLoading}
        queryData={combinedData}
      />
      <Stepper
        steps={[
          {
            title: 'Choose the detection method',
            component: (
              <AlertsCreateMetricsDetection
                selectedAlertType={alertType}
                handleTabClick={(tab) => setAlertType(tab)}
              />
            ),
          },
          {
            title: 'Pick metric',
            component: (
              <>
                <MetricsQueryBuilder
                  metricsQueryState={metricsQueryState}
                  blockedFunctionsCategories={['Algorithms']}
                />
              </>
            ),
          },
          {
            title: 'Set Condition & Evaluate',
            component: (
              <>
                {alertType == 'change' && (
                  <>
                    <AlertsCreateMetricsChangeCondition
                      conditionsState={conditionsState}
                      queryAndFormulaKeysLabel={getQueryAndFormulaKeysLabel(
                        queries,
                        formulas,
                      )}
                    />
                    <AlertsCreateEvaluate
                      alertsCreateState={alertsCreateState}
                    />
                  </>
                )}
                {alertType == 'threshold' && (
                  <>
                    <AlertsCreateConditions
                      alertType="threshold"
                      conditionsState={conditionsState}
                      queryAndFormulaKeysLabel={getQueryAndFormulaKeysLabel(
                        queries,
                        formulas,
                      )}
                      ruleType={ruleType.value}
                    />
                    <AlertsCreateEvaluate
                      alertsCreateState={alertsCreateState}
                    />
                  </>
                )}
                {alertType == 'outliers' && (
                  <>
                    <AlertCreateMetricsOutlierCondition
                      alertType={ruleType.value}
                      conditionsState={conditionsState}
                      queryAndFormulaKeysLabel={getQueryAndFormulaKeysLabel(
                        queries,
                        formulas,
                      )}
                    />
                    <AlertsCreateEvaluate
                      alertsCreateState={alertsCreateState}
                    />
                  </>
                )}
                {alertType == 'anomaly' && (
                  <>
                    <div className="anomaly__algorithm__container">
                      <AlertsCreateAnomalyCondition
                        conditionsState={conditionsState}
                      />
                      {anomalyCondition.anomalyAlgorithm === 'rrcf' ? (
                        <AlertsCreateAnomalyRRCFCondition
                          conditionsState={conditionsState}
                        />
                      ) : anomalyCondition.anomalyAlgorithm === 'basic' ? (
                        <AlertsCreateAnomalyBasicCondition
                          conditionsState={conditionsState}
                        />
                      ) : null}
                    </div>
                    {anomalyCondition.anomalyAlgorithm == 'rrcf' ? (
                      <AlertsAnomalyEvaluate
                        alertsCreateState={alertsCreateState}
                        conditionsState={conditionsState}
                      />
                    ) : (
                      <AlertsCreateEvaluate
                        alertsCreateState={alertsCreateState}
                      />
                    )}
                  </>
                )}
              </>
            ),
          },
          {
            title: 'Add Details',
            component: (
              <>
                <AlertsCreateDetails alertsCreateState={alertsCreateState} />
              </>
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
          if (alertType == 'change') {
            createChangeAlertsRule(
              conditions,
              formulas,
              metricsChangeCondition,
              queries,
            );
          } else if (alertType == 'outliers') {
            createOutlierAlertsRule(
              conditions,
              date,
              formulas,
              outlierCondition,
              queries,
            );
          } else if (alertType == 'anomaly') {
            createAnomalyDetectionRule(
              conditions,
              date,
              formulas,
              anomalyCondition,
              queries,
            );
          } else {
            createThresoldAlertsRule(conditions, date, formulas, queries);
          }
        }}
      />
    </div>
  );
};

export default AlertsCreateMetrics;
