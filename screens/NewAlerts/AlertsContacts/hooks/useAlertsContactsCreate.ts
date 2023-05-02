import { useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import { useState } from 'react';
import { getGrafanaAlertManager, mutateGrafanaContactPoints } from 'requests';

import {
  getContactPointSettings,
  validateContactRequiredFields,
} from '../utils';
import {
  ContactNotifierType,
  ReceiverConfigProps,
  ReceiverProps,
} from '../types';

const useAlertsContactsCreate = (onClose: (name: string) => void) => {
  const { addToast } = useToastmasterContext();
  const grafanaAlertManagerRequest = useRequest(getGrafanaAlertManager);
  const mutateContactPointsRequest = useRequest(mutateGrafanaContactPoints);
  const [error, setError] = useState<{ name?: string }>({});

  const getContactPointsCreatePayload = ({
    contactPointName,
    getNotifierData,
    selectedNotifierData,
    selectedNotifierTypes,
  }: {
    contactPointName: string;
    getNotifierData: (notifierType: string) => ContactNotifierType;
    selectedNotifierData: Array<{ [key: string]: string }>;
    selectedNotifierTypes: string[];
  }): ReceiverProps => {
    const contactPoints: any = [];
    selectedNotifierTypes.forEach((notifierType, index) => {
      const { options } = getNotifierData(notifierType);
      const selectedData = selectedNotifierData[index];
      const { settings, secureSettings } = getContactPointSettings(
        options,
        selectedData,
      );

      contactPoints.push({
        settings,
        secureSettings,
        type: notifierType,
        name: contactPointName,
        disableResolveMessage: false,
      });
    });

    const prepData = {
      name: contactPointName,
      grafana_managed_receiver_configs: contactPoints,
    };
    return prepData;
  };

  const getRouteMatchers = (contactPointName: string): any => {
    return {
      continue: false,
      group_by: [],
      mute_time_intervals: [],
      receiver: contactPointName,
      object_matchers: [[contactPointName, '=', 'true']],
      routes: [],
    };
  };

  const validateContactPoint = ({
    contactPointName,
    getNotifierData,
    selectedNotifierTypes,
    selectedNotifierData,
  }: {
    contactPointName: string;
    getNotifierData: (notifierType: string) => ContactNotifierType;
    selectedNotifierTypes: string[];
    selectedNotifierData: Array<{ [key: string]: string }>;
  }) => {
    if (!contactPointName) {
      setError({ name: 'Contact point name is required' });
      return false;
    }

    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(contactPointName)) {
      setError({
        name: 'Contact point name must be alphanumeric and underscore',
      });
      return false;
    }

    const checkRequiredFields = validateContactRequiredFields({
      getNotifierData,
      selectedNotifierData,
      selectedNotifierTypes,
    });

    if (!checkRequiredFields) {
      addToast({ text: 'Required fields are missing', status: 'error' });
      return false;
    }

    return true;
  };

  const mutateContactPoint = ({
    contactPointName,
    getNotifierData,
    selectedNotifierTypes,
    selectedNotifierData,
    type,
  }: {
    contactPointName: string;
    getNotifierData: (notifierType: string) => ContactNotifierType;
    selectedNotifierTypes: string[];
    selectedNotifierData: Array<{ [key: string]: string }>;
    type: 'create' | 'update';
  }) => {
    const data = {
      contactPointName,
      getNotifierData,
      selectedNotifierTypes,
      selectedNotifierData,
    };

    if (!validateContactPoint(data)) {
      return;
    }

    grafanaAlertManagerRequest.call().then((result: any) => {
      const alertManager = result.alertmanager_config;
      let successMessage = `Contact point ${contactPointName} was successfully created`;
      const createPayload = getContactPointsCreatePayload(data);
      if (type === 'create') {
        const routesPayload = getRouteMatchers(contactPointName);
        alertManager.receivers.push(createPayload);
        alertManager.route.routes.push(routesPayload);
      } else {
        const contactPointIndex = alertManager.receivers.findIndex(
          (receiver: ReceiverProps) => receiver.name === contactPointName,
        );
        const contactPoints: ReceiverProps =
          alertManager.receivers[contactPointIndex];

        contactPoints.grafana_managed_receiver_configs.forEach(
          (point: ReceiverConfigProps, index: number) => {
            createPayload.grafana_managed_receiver_configs[index].uid =
              point.uid;
          },
        );

        alertManager.receivers[contactPointIndex] = createPayload;
        successMessage = `Contact point ${name} was successfully updated`;
      }

      mutateContactPointsRequest
        .call({ alertmanager_config: alertManager })
        .then(() => {
          addToast({ text: successMessage, status: 'success' });
          onClose && onClose(contactPointName);
        });
    });
  };

  return {
    error,
    grafanaAlertManagerRequest,
    mutateContactPoint,
    mutateContactPointsRequest,
    setError,
  };
};

export default useAlertsContactsCreate;
