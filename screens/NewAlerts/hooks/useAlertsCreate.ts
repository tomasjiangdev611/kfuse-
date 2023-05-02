import { useToastmasterContext } from 'components';
import {
  useDateState,
  useLocalStorageState,
  useRequest,
  useUrlState,
} from 'hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createGrafanaAlertsRule,
  getDatasources,
  getGrafanaAlertsFolders,
  getGrafanaAlertsRuleByGroup,
  mutateGrafanaProvisionAlertById,
} from 'requests';
import { DateSelection } from 'types';
import { decodePromqlToReadable } from 'utils';

import {
  AlertsCreateDetailsProps,
  AlertsEvaluateProps,
  MutateAlertsFunctionProps,
  RuleProps,
} from '../types';
import {
  alertsCreateValidateForm,
  getCreateAlertQueries,
  getContactPointsForCreateAlert,
} from '../utils';

const useAlertsCreate = () => {
  const { addToast } = useToastmasterContext();
  const navigate = useNavigate();
  const [alertType, setAlertType] = useUrlState('alertType', { value: 'logs' });
  const [date, setDate] = useDateState();
  const [absoluteTimeRangeStorage, setabsoluteTimeRangeStorage] =
    useLocalStorageState('AbsoluteTimeRange', []);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [alertsDetails, setAlertsDetails] = useState<AlertsCreateDetailsProps>({
    description: '',
    folderName: '',
    groupName: '',
    ruleName: '',
    summary: '',
    tags: [],
    uid: '',
  });
  const [evaluate, setEvaluate] = useState<AlertsEvaluateProps>({
    every: '2m',
    for: '5m',
  });
  const [contactPoints, setContactPoints] = useState<string[]>([]);

  const grafanaAlertsRuleByGroupRequest = useRequest(
    getGrafanaAlertsRuleByGroup,
  );
  const createGrafanaAlertsRuleRequest = useRequest(createGrafanaAlertsRule);
  const getGrafanaAlertsFoldersRequest = useRequest(getGrafanaAlertsFolders);
  const mutateSLOAlertsRequest = useRequest(mutateGrafanaProvisionAlertById);
  const getDatasourcesRequest = useRequest(getDatasources);

  const onDateChange = (nextDate: DateSelection) => {
    const { startTimeUnix, endTimeUnix, startLabel, endLabel } = nextDate;
    if (!startLabel && !endLabel) {
      setabsoluteTimeRangeStorage((preHistory) => {
        if (preHistory.length > 3) {
          preHistory.pop();
        }
        return [...[{ startTimeUnix, endTimeUnix }], ...preHistory];
      });
    }

    setDate(nextDate);
  };

  const mutateAlertsRule = async ({
    condition,
    datasourceType,
    date,
    promqlQuery,
    ruleAnnotations,
  }: MutateAlertsFunctionProps) => {
    if (
      !alertsCreateValidateForm(alertsDetails, evaluate, condition, addToast)
    ) {
      setIsSaving(false);
      return;
    }

    const datasource = getDatasourcesRequest.result.find(
      (datasource: any) => datasource.type === datasourceType,
    );
    const rulesBasic = {
      for: evaluate.for,
      annotations: {
        description: alertsDetails.description,
        runbookUrl: alertsDetails.runbookUrl,
        summary: alertsDetails.summary,
        ...ruleAnnotations,
      },
      labels: getContactPointsForCreateAlert([
        ...contactPoints,
        ...alertsDetails.tags,
      ]),
    };

    const alertsDetailsRule = {
      title: alertsDetails.ruleName,
      condition: 'C',
      no_data_state: 'NoData',
      exec_err_state: 'Alerting',
    };

    const sanitizedPromql = decodePromqlToReadable(promqlQuery);
    const dataQueries = getCreateAlertQueries(
      condition,
      date,
      sanitizedPromql,
      datasource.uid,
      evaluate,
    );

    grafanaAlertsRuleByGroupRequest
      .call(alertsDetails.folderName, alertsDetails.groupName)
      .then((res: any) => {
        const grafanaAlertsRule = {
          name: alertsDetails.groupName,
          interval: evaluate.every,
          rules: [...res.rules],
        };
        let successMessage = 'Alerts rule created successfully';

        if (isEditing && alertsDetails.uid) {
          const ruleIndex = grafanaAlertsRule.rules.findIndex(
            (rule: any) => rule.grafana_alert.uid === alertsDetails.uid,
          );
          grafanaAlertsRule.rules[ruleIndex] = {
            ...rulesBasic,
            grafana_alert: {
              ...grafanaAlertsRule.rules[ruleIndex].grafana_alert,
              title: alertsDetails.ruleName,
              data: dataQueries,
            },
          };
          successMessage = 'Alerts rule updated successfully';
        } else {
          grafanaAlertsRule.rules.push({
            ...rulesBasic,
            grafana_alert: { ...alertsDetailsRule, data: dataQueries },
          });
        }

        createGrafanaAlertsRuleRequest
          .call(alertsDetails.folderName, grafanaAlertsRule)
          .then((resCreate: any) => {
            setIsSaving(false);
            addToast({ text: successMessage, status: 'success' });
            navigate(`/alerts`);
          })
          .catch((err: any) => {
            setIsSaving(false);
            addToast({ text: err.message, status: 'error' });
          });
      })
      .catch((err: any) => {
        setIsSaving(false);
        addToast({ text: err.message, status: 'error' });
      });
  };

  const mutateSLOAlertsRule = async (provisionRule: any) => {
    setIsSaving(true);
    const rulesBasic = {
      annotations: {
        description: alertsDetails.description,
        runbookUrl: alertsDetails.runbookUrl,
        summary: alertsDetails.summary,
      },
      labels: getContactPointsForCreateAlert([
        ...contactPoints,
        ...alertsDetails.tags,
      ]),
      title: alertsDetails.ruleName,
    };

    mutateSLOAlertsRequest
      .call({ ...provisionRule, ...rulesBasic }, alertsDetails.uid)
      .then((res: any) => {
        setIsSaving(false);
        addToast({
          text: 'Alerts rule updated successfully',
          status: 'success',
        });
        navigate(`/alerts`);
      })
      .catch((err: any) => {
        setIsSaving(false);
        addToast({ text: err.message, status: 'error' });
      });
  };

  const setUpdateAlertsRuleState = (rule: RuleProps) => {
    setAlertsDetails({
      description: rule.annotations.description,
      folderName: rule.groupFile,
      groupName: rule.group,
      ruleName: rule.name,
      runbookUrl: rule.annotations.runbookUrl,
      summary: rule.annotations.summary,
      tags: rule.tags,
      uid: rule.uid,
    });
    setEvaluate(rule.evaluate);
    setContactPoints(rule.contactPointLabels);
    setIsEditing(true);
  };

  useEffect(() => {
    getDatasourcesRequest.call();
  }, []);

  return {
    absoluteTimeRangeStorage,
    addToast,
    alertsDetails,
    alertType,
    contactPoints,
    date,
    evaluate,
    isEditing,
    isSaving,
    getDatasourcesRequest,
    getGrafanaAlertsFoldersRequest,
    mutateAlertsRule,
    mutateSLOAlertsRule,
    setAlertsDetails,
    setContactPoints,
    setDate: (date: DateSelection) => onDateChange(date),
    setEvaluate,
    setIsSaving,
    setUpdateAlertsRuleState,
  };
};

export default useAlertsCreate;
