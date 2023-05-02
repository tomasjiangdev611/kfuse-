import { AutocompleteOption } from 'components';

export const getContactPoints = (alertmanager: any): AutocompleteOption[] => {
  const contactPointsOptions: AutocompleteOption[] = [];

  if (alertmanager && alertmanager.receivers) {
    alertmanager.receivers.forEach((receiver: any) => {
      contactPointsOptions.push({
        label: receiver.name,
        value: receiver.name,
      });
    });
  }

  return contactPointsOptions;
};

export const getContactPointsList = (alertmanager: any): Array<any> => {
  const contactPointsList: Array<any> = [];

  if (alertmanager && alertmanager.receivers) {
    alertmanager.receivers.forEach((receiver: any) => {
      if (!receiver.grafana_managed_receiver_configs) {
        return;
      }
      contactPointsList.push({
        name: receiver.name,
        type: receiver.grafana_managed_receiver_configs
          .map((points: any) => points.type)
          .join(','),
        receiver,
      });
    });
  }

  return contactPointsList;
};
