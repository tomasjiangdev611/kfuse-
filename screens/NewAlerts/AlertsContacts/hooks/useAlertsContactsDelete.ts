import { useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import { useState } from 'react';
import {
  getGrafanaAlertManager,
  getGrafanaAlertsStatus,
  mutateGrafanaContactPoints,
} from 'requests';

import { ReceiverProps } from '../types';

const useAlertsContactsDelete = () => {
  const { addToast } = useToastmasterContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const grafanaAlertManagerRequest = useRequest(getGrafanaAlertManager);
  const grafanaAlertsRulesRequest = useRequest(getGrafanaAlertsStatus);
  const mutateContactPointsRequest = useRequest(mutateGrafanaContactPoints);

  const checkContactPointUsed = (name: string) => {
    return new Promise<void>((resolve, reject) => {
      grafanaAlertsRulesRequest
        .call('rules')
        .then((result: any) => {
          const folderList = Object.keys(result);
          folderList.forEach((folder) => {
            const group = result[folder];
            group.forEach((rule: any) => {
              const rules = rule.rules;
              rules.forEach((rule: any) => {
                if (Object.keys(rule.labels || {}).includes(name)) {
                  reject();
                }
              });
              resolve();
            });
          });
        })
        .catch(() => reject());
    });
  };

  const getContactPointsDeletePayload = (
    name: string,
    receivers: ReceiverProps[],
  ) => {
    const contactPointIndex = receivers.findIndex(
      (receiver: any) => receiver.name === name,
    );
    const newReceivers = [...receivers];
    newReceivers.splice(contactPointIndex, 1);
    return newReceivers;
  };

  const deleteContactPoint = (name: string) => {
    setIsDeleting(true);
    checkContactPointUsed(name)
      .then(() => {
        grafanaAlertManagerRequest
          .call()
          .then((result: any) => {
            const alertManager = result.alertmanager_config;
            alertManager.receivers = getContactPointsDeletePayload(
              name,
              alertManager.receivers,
            );
            const routeIndex = alertManager.route.routes.findIndex(
              (route: any) => route.receiver === name,
            );
            alertManager.route.routes.splice(routeIndex, 1);
            const successMessage = `Contact point ${name} was successfully deleted`;

            mutateContactPointsRequest
              .call({ alertmanager_config: alertManager })
              .then(() => {
                addToast({ text: successMessage, status: 'success' });
                setIsDeleting(false);
              });
          })
          .catch(() => {
            setIsDeleting(false);
          });
      })
      .catch(() => {
        setIsDeleting(false);
        addToast({
          text: `Contact point ${name} is used in a rule and cannot be deleted`,
          status: 'error',
          timeout: 5000,
        });
        return;
      });
  };

  return {
    deleteContactPoint,
    isDeleting,
    mutateContactPointsRequest,
  };
};

export default useAlertsContactsDelete;
