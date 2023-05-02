import { AutocompleteOption, useToastmasterContext } from 'components';
import { useRequest } from 'hooks';
import { useEffect, useState } from 'react';
import { getGrafanaAlertsNotifiers, testGrafanaContactPoint } from 'requests';

import { getContactPointSettings, getNotifiersTypeOptions } from '../utils';
import { ContactNotifierType, ReceiverProps } from '../types';

const useAlertsContactsState = () => {
  const { addToast } = useToastmasterContext();
  const grafanaAlertsNotifiesRequest = useRequest(getGrafanaAlertsNotifiers);
  const testContactPointRequest = useRequest(testGrafanaContactPoint);

  const [editMode, setEditMode] = useState(false);
  const [contactPointName, setContactPointName] = useState('');
  const [notifiersTypes, setNotifiersTypes] = useState<AutocompleteOption[]>(
    [],
  );
  const [selectedNotifierTypes, setSelectedNotifierTypes] = useState<string[]>([
    'email',
  ]);
  const [selectedNotifierData, setSelectedNotifierData] = useState<
    Array<{ [key: string]: any }>
  >([{}]);

  useEffect(() => {
    grafanaAlertsNotifiesRequest.call().then((result: any) => {
      setNotifiersTypes(getNotifiersTypeOptions(result));
    });
  }, []);

  const getNotifierData = (notifierType: string) => {
    if (grafanaAlertsNotifiesRequest.result) {
      return grafanaAlertsNotifiesRequest.result.find(
        (notifier: ContactNotifierType) => notifier.type === notifierType,
      );
    }
    return null;
  };

  const updateSelectedNotifierTypes = (
    notifierIndex: number,
    notifierType: string,
  ) => {
    const newSelectedNotifierTypes = [...selectedNotifierTypes];
    newSelectedNotifierTypes[notifierIndex] = notifierType;

    const newSelectedNotifierData = [...selectedNotifierData];
    newSelectedNotifierData[notifierIndex] = {};

    setSelectedNotifierData(newSelectedNotifierData);
    setSelectedNotifierTypes(newSelectedNotifierTypes);
  };

  const addNotifierType = () => {
    const newSelectedNotifierTypes = [...selectedNotifierTypes, 'email'];
    const newSelectedNotifierData = [...selectedNotifierData, {}];

    setSelectedNotifierData(newSelectedNotifierData);
    setSelectedNotifierTypes(newSelectedNotifierTypes);
  };

  const updateSelectedNotifierData = (
    notifierIndex: number,
    propertyKey: string,
    propertyValue: any,
  ) => {
    const newSelectedNotifierData = [...selectedNotifierData];
    if (!newSelectedNotifierData[notifierIndex]) {
      newSelectedNotifierData[notifierIndex] = {};
    }
    newSelectedNotifierData[notifierIndex] = {
      ...newSelectedNotifierData[notifierIndex],
      [propertyKey]: propertyValue,
    };
    setSelectedNotifierData(newSelectedNotifierData);
  };

  const removeSelectedNotifier = (notifierIndex: number) => {
    const newSelectedNotifierTypes = [...selectedNotifierTypes];
    newSelectedNotifierTypes.splice(notifierIndex, 1);

    const newSelectedNotifierData = [...selectedNotifierData];
    newSelectedNotifierData.splice(notifierIndex, 1);

    setSelectedNotifierData(newSelectedNotifierData);
    setSelectedNotifierTypes(newSelectedNotifierTypes);
  };

  const setUpdatedContactPointState = (receiver: ReceiverProps) => {
    const points = receiver.grafana_managed_receiver_configs;
    const newSelectedNotifierTypes: string[] = [];
    const newSelectedNotifierData: Array<{
      [key: string]: any;
    }> = [];

    points.forEach((point: any) => {
      newSelectedNotifierTypes.push(point.type);
      newSelectedNotifierData.push({
        ...point.settings,
      });
    });

    setEditMode(true);
    setContactPointName(receiver.name);
    setSelectedNotifierTypes(newSelectedNotifierTypes);
    setSelectedNotifierData([...newSelectedNotifierData]);
  };

  const getContactPointsCreatePayload = (): ReceiverProps => {
    const contactPoints: any = [];
    selectedNotifierTypes.forEach((notifierType, index) => {
      const notifierData = getNotifierData(notifierType);
      const selectedData = selectedNotifierData[index];
      const { settings, secureSettings } = getContactPointSettings(
        notifierData.options,
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

  const testContactPoint = (notifierIndex: number) => {
    const createPayload = getContactPointsCreatePayload();

    const payload = {
      receivers: [
        {
          grafana_managed_receiver_configs: [
            createPayload.grafana_managed_receiver_configs[notifierIndex],
          ],
          name: 'test',
        },
      ],
    };

    testContactPointRequest
      .call(payload)
      .then((result: any) => {
        addToast({ text: 'Test was successful', status: 'success' });
      })
      .catch((error: any) => {});
  };

  return {
    addNotifierType,
    contactPointName,
    editMode,
    getNotifierData,
    grafanaAlertsNotifiesRequest,
    notifiersTypes,
    removeSelectedNotifier,
    setContactPointName,
    selectedNotifierData,
    selectedNotifierTypes,
    setUpdatedContactPointState,
    testContactPoint,
    updateSelectedNotifierData,
    updateSelectedNotifierTypes,
  };
};

export default useAlertsContactsState;
