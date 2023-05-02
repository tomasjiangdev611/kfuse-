import { getDateFromSecondRange, parsePromqlAndBuildQuery } from 'utils';

import { parseChangePromql } from './alerts-create-metrics-change';
import { parseOutlierPromql } from './alerts-create-metrics-outlier';
import {
  ConditionProps,
  MetricChangeConditionProps,
  OutlierConditionProps,
  AnomalyConditionProps,
} from '../types';

export const parseAlertsQueryAndConditions = (
  data: Array<any>,
  alertType: string,
) => {
  const { conditionQueryKey, newConditions, promqls, ...rest } =
    getRulePromqlAndConditions(data, alertType);

  const { queries, formulas } = parsePromqlAndBuildQuery(promqls);
  if (formulas.length > 0) {
    newConditions[0].queryKey = `Formula (1)`;
    queries.map((_, idx) => {
      queries[idx].isActive = false;
    });
  } else {
    newConditions[0].queryKey = `Query (${conditionQueryKey})`;
  }

  return {
    conditions: newConditions,
    formulas,
    newConditions,
    queries,
    ...rest,
  };
};

export const getRulePromqlAndConditions = (
  data: Array<any>,
  alertType?: string,
) => {
  const promqls: string[] = [];
  const newConditions = getConditionValues(data);
  let conditionQueryKey = 'a';
  let relativeTimeRange: { from: number; to: number } = {};
  const outlierCondition: OutlierConditionProps = {};
  const changeCondition: MetricChangeConditionProps = {};

  data.map((item) => {
    const { datasourceUid, model } = item;
    if (datasourceUid !== '-100') {
      relativeTimeRange = item.relativeTimeRange;
      if (model.hide === false) {
        conditionQueryKey = model.refId.toLocaleLowerCase();
      }

      if (alertType === 'outliers') {
        const { promql, algorithm, tolerance } = getAlertPromqlForEdit(
          model.expr,
          alertType,
        );
        outlierCondition.algorithm = algorithm;
        outlierCondition.tolerance = tolerance;
        promqls.push(promql);
        return;
      }

      if (alertType === 'change') {
        const { change, promql, time } = getAlertPromqlForEdit(
          model.expr,
          alertType,
        );
        const comparedTime = getDateFromSecondRange(
          relativeTimeRange.from,
          relativeTimeRange.to,
        );
        changeCondition.time = time;
        changeCondition.change = change;
        changeCondition.comparedTime = comparedTime.startLabel;
        promqls.push(promql);
        return;
      }

      promqls.push(model.expr);
      return;
    }
  });

  return {
    changeCondition,
    conditionQueryKey,
    newConditions,
    promqls,
    outlierCondition,
    relativeTimeRange,
  };
};

const getConditionValues = (data: Array<any>) => {
  const newConditions: ConditionProps[] = [
    { of: 'gt', value: '', when: 'last' },
  ];
  const reducerCondition = data.find((item) => item.model.type === 'reduce');
  const mathCondition = data.find((item) => item.model.type === 'math');
  if (!reducerCondition && !mathCondition) return newConditions;

  if (reducerCondition) {
    const { model } = reducerCondition;
    const { reducer } = model;
    const sanitizedType = reducer.replace('()', '');
    newConditions[0].when = sanitizedType;
  }

  if (mathCondition) {
    const { model } = mathCondition;
    const { conditions } = model;

    conditions.map((condition) => {
      const { evaluator } = condition;
      const { params } = evaluator;
      const [value] = params;
      newConditions[0].of = evaluator.type;
      newConditions[0].value = value;
    });
  }
  return newConditions;
};

const getAlertPromqlForEdit = (
  promql: string,
  alertType?: string,
): {
  change?: string;
  promql: string;
  algorithm?: string;
  tolerance?: string;
  time?: string;
} => {
  if (!alertType || alertType === 'thresold') return { promql };

  if (alertType === 'change') {
    return parseChangePromql(promql);
  }

  if (alertType === 'outliers') {
    return parseOutlierPromql(promql);
  }

  return { promql };
};

export const buildAnomalyDetectionPromql = (
  promql: string,
  anomalyCondition: AnomalyConditionProps,
): string => {
  if (!promql) return '';
  const { x, y } = anomalyCondition;
  return `rrcf_anomalies(${promql}, 10, ${x}, ${y}, 1.1, 0.99, 1, 1, 1)`;
};
