import { useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import {
  createGrafanaAlertsRule,
  getGrafanaAlertsRuleByGroup,
  removeAnomalyAlertMetric,
} from 'requests';
import { DeleteRuleProps } from '../types';

const useAlertsDelete = () => {
  const { addToast } = useToastmasterContext();
  const removeanoamlyAlertMetricRequest = useRequest(removeAnomalyAlertMetric);
  const grafanaAlertsRuleByGroupRequest = useRequest(
    getGrafanaAlertsRuleByGroup,
  );
  const createGrafanaAlertsRuleRequest = useRequest(createGrafanaAlertsRule);

  const deleteAlertsRule = (ruleData: DeleteRuleProps) => {
    if (ruleData.alertType == 'anomaly') {
      const metricName = ruleData.metricName;
      const prefix = 'rrcf_anamolies_';
      const modifiedMetricName = metricName.replace(prefix, '');
      removeanoamlyAlertMetricRequest
        .call({
          metricName: modifiedMetricName,
        })
        .then((res: any) => {
          if (!res) {
            addToast({
              text: 'Failed to delete Anomaly alert',
              status: 'error',
            });
            return;
          }
        });
    }
    const errorToast = { text: 'Error deleting alerts rule', status: 'error' };
    return new Promise((resolve, reject) => {
      grafanaAlertsRuleByGroupRequest
        .call(ruleData.folderName, ruleData.groupFile)
        .then((res: any) => {
          if (res) {
            const payload = { ...res };
            payload.rules = payload.rules.filter(
              (rule: any) => rule.grafana_alert.uid !== ruleData.uid,
            );
            createGrafanaAlertsRuleRequest
              .call(ruleData.folderName, payload)
              .then((resCreate: any) => {
                if (resCreate.message.indexOf('successfully') > -1) {
                  addToast({
                    text: 'Alerts rule deleted successfully',
                    status: 'success',
                  });
                } else {
                  addToast(errorToast);
                }
                resolve(true);
              })
              .catch(() => {
                addToast(errorToast);
                reject();
              });
          }
        })
        .catch(() => {
          addToast(errorToast);
          reject();
        });
    });
  };

  return { deleteAlertsRule };
};

export default useAlertsDelete;
