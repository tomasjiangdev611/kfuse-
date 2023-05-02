import { useRequest, useUrlState } from 'hooks';
import { useState } from 'react';
import { deleteLogsMetric, saveLogsMetrics } from 'requests';
import { useLogsWorkbooksState } from 'screens/Logs/hooks';
import { LogsMetricQueryProps } from 'types';
import { getLabelAndFacetOnly } from 'utils/saveMetrics';

import { useAlertsCreate } from '../hooks';
import { ConditionProps } from '../types';
import { getLabelWithDelimiter, getAlertNamingConvention } from '../utils';

const useAlertsCreateLogs = (
  alertsCreateState: ReturnType<typeof useAlertsCreate>,
) => {
  const { currentLogsState } = useLogsWorkbooksState();
  const {
    addToast,
    alertsDetails,
    date,
    isEditing,
    mutateAlertsRule,
    setIsSaving,
  } = alertsCreateState;

  const [filterByFacets, setFilterByFacets] = useUrlState('filterByFacets', []);
  const [searchTerms, setSearchTerms] = useUrlState('searchTerms', []);
  const [logsExplorerType, setLogsExplorerType] = useState('builder');
  const [logQLText, setLogQLText] = useState('');
  const [savedMetricName, setSavedMetricName] = useState('');

  const deleteLogsMetricRequest = useRequest(deleteLogsMetric);
  const saveLogsMetricsRequest = useRequest(saveLogsMetrics);

  const updateLogQLAndType = (logQL: string, explorerType: string) => {
    setLogQLText(logQL);
    setLogsExplorerType(explorerType);
  };

  const logsAlertsState = {
    filterByFacets,
    searchTerms,
    setFilterByFacets,
    setSearchTerms,
  };
  const newLogsAlertsState = { ...logsAlertsState, ...currentLogsState };

  const createLogQLAlertsRule = (condition: ConditionProps, logQL: string) => {
    setIsSaving(true);
    mutateAlertsRule({
      condition,
      datasourceType: 'loki',
      date,
      promqlQuery: logQL,
      ruleAnnotations: {
        ruleType: 'logs',
        extraData: JSON.stringify({ logQL }),
      },
    });
  };

  const createLogsAlertsRule = (
    condition: ConditionProps,
    query: LogsMetricQueryProps,
  ) => {
    setIsSaving(true);
    const payload = { condition, query };
    if (isEditing) {
      deleteSavedMertic(savedMetricName)
        .then(() => {
          saveMetricAndCreateAlert(payload);
        })
        .catch(() => {
          setIsSaving(false);
          addToast({ text: 'Error while saving alerts rule', status: 'error' });
        });
    } else {
      saveMetricAndCreateAlert(payload);
    }
  };

  const createLogsMetric = (query: LogsMetricQueryProps) => {
    const { metric, rangeAggregate, rangeAggregateGrouping } = query;
    const filterObject = {
      filterByFacets: newLogsAlertsState.filterByFacets,
      filterOrExcludeByFingerprint:
        newLogsAlertsState.filterOrExcludeByFingerprint,
      keyExists: newLogsAlertsState.keyExists,
      searchTerms: newLogsAlertsState.searchTerms,
      selectedFacetValues: newLogsAlertsState.selectedFacetValues,
    };

    let labelGrouping: string[] = [];
    if (rangeAggregateGrouping.length === 0) {
      labelGrouping = getLabelWithDelimiter();
    } else {
      labelGrouping = rangeAggregateGrouping;
    }

    const promql = getAlertNamingConvention(
      metric,
      rangeAggregate,
      alertsDetails.ruleName,
      labelGrouping,
    );

    return new Promise((resolve, reject) => {
      saveLogsMetricsRequest
        .call({
          filter: filterObject,
          labels: getLabelAndFacetOnly(labelGrouping),
          metric,
          name: promql,
          normalizeFunction: query.normalizeFunction,
          rangeAggregate,
          rangeAggregateParam: query.rangeAggregateParam,
        })
        .then((saveMetricResponse: any) => {
          if (saveMetricResponse) {
            resolve(promql);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  };

  const saveMetricAndCreateAlert = ({
    condition,
    query,
  }: {
    condition: ConditionProps;
    query: LogsMetricQueryProps;
  }) => {
    createLogsMetric(query)
      .then((promql: string) => {
        const { filterByFacets, searchTerms } = newLogsAlertsState;
        const extraData = { filterByFacets, searchTerms, query };
        mutateAlertsRule({
          condition,
          datasourceType: 'prometheus',
          date,
          promqlQuery: promql,
          ruleAnnotations: {
            ruleType: 'logs',
            extraData: JSON.stringify(extraData),
          },
        });
      })
      .catch(() => {
        addToast({ text: 'Failed to create alerts rule', status: 'error' });
        return;
      });
  };

  const deleteSavedMertic = (metric: string) => {
    return new Promise((resolve, reject) => {
      deleteLogsMetricRequest
        .call(metric)
        .then((res: any) => {
          if (res) {
            resolve(true);
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  };

  return {
    ...newLogsAlertsState,
    createLogsAlertsRule,
    createLogQLAlertsRule,
    logsExplorerType,
    logQLText,
    setLogsExplorerType,
    setLogQLText,
    setSavedMetricName,
    updateLogQLAndType,
  };
};

export default useAlertsCreateLogs;
