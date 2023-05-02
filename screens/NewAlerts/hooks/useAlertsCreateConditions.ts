import { useState } from 'react';
import isNumber from 'utils/isNumber';

import {
  ConditionProps,
  MetricChangeConditionProps,
  OutlierConditionProps,
  AnomalyConditionProps,
} from '../types';

const defaultCondition: ConditionProps = {
  of: 'gt',
  queryKey: 'Query (a)',
  value: '',
  valueError: '',
  when: 'last',
};

const defaultMetrics: MetricChangeConditionProps = {
  change: 'change',
  time: 'now-1h',
  comparedTime: 'now-5m',
};

const defaultOutliersCondition: OutlierConditionProps = {
  algorithm: 'DBSCAN',
  tolerance: '0.6',
};

const defaultAnomalyCondition: AnomalyConditionProps = {
  anomalyAlgorithm: 'rrcf',
  globalHistory: 'now-4h',
  localHistory: 'now-15m',
  metricName: '',
  x: '256',
  y: '15',
  step: '60',
  window: '5m',
  bound: '1',
  band: 'both',
};

const useAlertsCreateConditions = () => {
  const [conditions, setConditions] = useState<ConditionProps[]>([
    defaultCondition,
  ]);
  const [metricsChangeCondition, setMetricsChangeCondition] =
    useState<MetricChangeConditionProps>(defaultMetrics);
  const [outlierCondition, setOutlierCondition] =
    useState<OutlierConditionProps>(defaultOutliersCondition);
  const [anomalyCondition, setAnomalyCondition] =
    useState<AnomalyConditionProps>(defaultAnomalyCondition);

  const updateCondition = (
    index: number,
    propertyKey: string,
    value: string,
  ) => {
    setConditions((prevConditions) => {
      const newConditions = [...prevConditions];
      if (
        propertyKey === 'value' ||
        propertyKey === 'valueRange' ||
        propertyKey === 'valueError'
      ) {
        if (!isNumber(value)) {
          newConditions[index].valueError = 'Value must be a number';
        } else {
          newConditions[index].valueError = '';
        }
      }

      if (propertyKey === 'valueRangeMin') {
        newConditions[index].valueRange = {
          min: value,
          max: newConditions[index].valueRange.max,
        };
        return newConditions;
      }

      if (propertyKey === 'valueRangeMax') {
        newConditions[index].valueRange = {
          min: newConditions[index].valueRange.min,
          max: value,
        };
        return newConditions;
      }

      newConditions[index][propertyKey] = value;
      return newConditions;
    });
  };

  const setUpdateConditionState = (condition: ConditionProps[]) => {
    setConditions([...condition]);
  };

  return {
    conditions,
    metricsChangeCondition,
    outlierCondition,
    anomalyCondition,
    updateCondition,
    setAnomalyCondition,
    setMetricsChangeCondition,
    setUpdateConditionState,
    setConditions,
    setOutlierCondition,
  };
};

export default useAlertsCreateConditions;
