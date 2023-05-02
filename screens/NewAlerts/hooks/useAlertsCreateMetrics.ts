import { useRequest } from 'hooks';
import { useEffect, useState } from 'react';
import { addAnomalyAlertMetric, promqlMetadata } from 'requests';
import { getDateFromRange } from 'screens/Dashboard/utils';
import { DateSelection, ExplorerQueryProps, FormulaProps } from 'types';
import { convertFromAndToDate } from 'utils';

import { useAlertsCreate, useAlertsCreateConditions } from '../hooks';
import {
  ConditionProps,
  MetricChangeConditionProps,
  OutlierConditionProps,
  AnomalyConditionProps,
} from '../types';
import {
  buildAnomalyDetectionPromql,
  buildChangeAlertPromql,
  buildOutlierAlertPromql,
  getPromQlQuery,
  validateMetricName,
} from '../utils';
import { getBasicAnomaliesPromQL } from 'utils/MetricsQueryBuilder/functions-anomalies';

const useAlertsCreateMetrics = (
  alertsCreateState: ReturnType<typeof useAlertsCreate>,
  conditionsState: ReturnType<typeof useAlertsCreateConditions>,
) => {
  const [alertType, setAlertType] = useState<string>('threshold');
  const { addToast, mutateAlertsRule, setIsSaving } = alertsCreateState;
  const { metricsChangeCondition: changeCondition, outlierCondition } =
    conditionsState;

  const metricMetadataRequest = useRequest(promqlMetadata);
  const addAnoamlyAlertMetricRequest = useRequest(addAnomalyAlertMetric);

  const createThresoldAlertsRule = (
    conditions: ConditionProps[],
    date: DateSelection,
    formulas: FormulaProps[],
    queries: ExplorerQueryProps[],
  ) => {
    const { queryKey } = conditions[0];
    const { promql } = getPromQlQuery(formulas, queryKey, queries);
    if (!promql) {
      addToast({ text: 'Not a valid query', status: 'error' });
      return;
    }

    setIsSaving(true);
    mutateAlertsRule({
      condition: conditions[0],
      datasourceType: 'prometheus',
      date,
      promqlQuery: promql,
      ruleAnnotations: { alertType: 'threshold', ruleType: 'metrics' },
    });
  };

  const createChangeAlertsRule = (
    conditions: ConditionProps[],
    formulas: FormulaProps[],
    changeCondition: MetricChangeConditionProps,
    queries: ExplorerQueryProps[],
  ) => {
    const { queryKey } = conditions[0];
    const { promql, metric } = getPromQlQuery(formulas, queryKey, queries);
    if (!promql) {
      addToast({ text: 'Not a valid query', status: 'error' });
      return;
    }

    setIsSaving(true);
    const changePromql = buildChangeAlertPromql(changeCondition, promql);
    mutateAlertsRule({
      condition: conditions[0],
      datasourceType: 'prometheus',
      date: getDateFromRange(changeCondition.comparedTime, 'now'),
      promqlQuery: changePromql,
      ruleAnnotations: { alertType: 'change', ruleType: 'metrics' },
    });
  };

  const createOutlierAlertsRule = (
    conditions: ConditionProps[],
    date: DateSelection,
    formulas: FormulaProps[],
    outliersCondition: OutlierConditionProps,
    queries: ExplorerQueryProps[],
  ) => {
    const { queryKey } = conditions[0];
    const { promql } = getPromQlQuery(formulas, queryKey, queries);
    if (!promql) {
      addToast({ text: 'Not a valid query', status: 'error' });
      return;
    }

    const outlierPromql = buildOutlierAlertPromql(promql, outliersCondition);

    setIsSaving(true);
    conditions[0].value = '0';
    mutateAlertsRule({
      condition: conditions[0],
      datasourceType: 'prometheus',
      date,
      promqlQuery: outlierPromql,
      ruleAnnotations: { alertType: 'outliers', ruleType: 'metrics' },
    });
  };

  const createAnomalyDetectionRule = (
    conditions: ConditionProps[],
    date: DateSelection,
    formulas: FormulaProps[],
    anomalyCondition: AnomalyConditionProps,
    queries: ExplorerQueryProps[],
  ) => {
    const { queryKey } = conditions[0];
    const { promql } = getPromQlQuery(formulas, queryKey, queries);
    if (!promql) {
      addToast({ text: 'Not a valid query', status: 'error' });
      return;
    }

    if (anomalyCondition.anomalyAlgorithm == 'rrcf') {
      const anomalyPromql = buildAnomalyDetectionPromql(
        promql,
        anomalyCondition,
      );
      const metricName = validateMetricName(
        anomalyCondition.metricName,
        addToast,
      );

      if (metricName) {
        setIsSaving(true);
        addAnoamlyAlertMetricRequest
          .call({
            expr: promql,
            metricName: anomalyCondition.metricName,
            description: 'doing_rrcf_on_' + anomalyCondition.metricName,
            numTrees: 10,
            treeSize: parseInt(anomalyCondition.x),
            shingle: parseInt(anomalyCondition.y),
            step: 60,
          })
          .then((res: any) => {
            if (!res || !res.metric_names) {
              setIsSaving(false);
              addToast({
                text: 'Failed to create Anomaly alert',
                status: 'error',
              });
              return;
            }
            conditions[0].value = '0';
            mutateAlertsRule({
              condition: conditions[0],
              datasourceType: 'prometheus',
              date,
              promqlQuery: res.metric_names[1],
              ruleAnnotations: { alertType: 'anomaly', ruleType: 'metrics' },
            });
          })
          .catch((err: any) => {
            setIsSaving(false);
            addToast({
              text: 'Failed to create Anomaly alert',
              status: 'error',
            });
            return;
          });
      }
    } else {
      const basicAnomaliesFunction = getBasicAnomaliesPromQL(
        anomalyCondition,
        promql,
      );
      let promQLQuery = '';
      if (anomalyCondition.band == 'upper') {
        conditions[0].of = 'gt';
        promQLQuery = `${promql}-${basicAnomaliesFunction[0]}`;
      } else if (anomalyCondition.band == 'lower') {
        conditions[0].of = 'lt';
        promQLQuery = `${promql} - ${basicAnomaliesFunction[1]}`;
      } else {
        conditions[0].of = 'neq';
        promQLQuery = `${promql} - ${basicAnomaliesFunction[0]} > 0 or ${promql} - ${basicAnomaliesFunction[1]} < 0`;
      }
      conditions[0].value = '0';
      if (promQLQuery != '') {
        setIsSaving(true);
        mutateAlertsRule({
          condition: conditions[0],
          datasourceType: 'prometheus',
          date,
          promqlQuery: promQLQuery,
          ruleAnnotations: { alertType: 'anomaly', ruleType: 'metrics' },
        });
      }
    }
  };

  const appendPromqlForChart = (promql: string, metricName: string): string => {
    if (alertType === 'change') {
      return buildChangeAlertPromql(changeCondition, promql);
    }

    if (alertType === 'outliers') {
      return buildOutlierAlertPromql(promql, outlierCondition, 'load');
    }

    return promql;
  };

  const setChangeAndOutlierConditions = (
    newAlertType: string,
    newChangeCondition: MetricChangeConditionProps,
    newOutlierCondition: OutlierConditionProps,
    relativeTimeRange: { from: number; to: number },
  ) => {
    if (newAlertType === 'change') {
      const { from, to } = relativeTimeRange;
      const { startLabel } = convertFromAndToDate(from, to);
      conditionsState.setMetricsChangeCondition({
        ...changeCondition,
        ...newChangeCondition,
        ...{ comparedTime: startLabel },
      });
    }

    if (newAlertType === 'outliers') {
      conditionsState.setOutlierCondition({
        ...outlierCondition,
        ...newOutlierCondition,
      });
    }
  };

  useEffect(() => {
    if (alertType === 'change' && !metricMetadataRequest.result) {
      metricMetadataRequest.call();
    }
  }, [alertType]);

  return {
    appendPromqlForChart,
    alertType,
    createAnomalyDetectionRule,
    createThresoldAlertsRule,
    createChangeAlertsRule,
    createOutlierAlertsRule,
    setAlertType,
    setChangeAndOutlierConditions,
  };
};

export default useAlertsCreateMetrics;
