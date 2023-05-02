import { AutocompleteOption } from 'components';
import { ContactNotifierType } from '../../types';

const SUPPORTED_NOTIFIER = ['email', 'slack', 'webhook', 'pagerduty'];

export const getNotifiersTypeOptions = (
  notifiers: Array<any>,
): AutocompleteOption[] => {
  const notifiersTypeOptions: AutocompleteOption[] = [];
  notifiers.forEach((notifier) => {
    if (SUPPORTED_NOTIFIER.includes(notifier.type)) {
      notifiersTypeOptions.push({
        label: notifier.name,
        value: notifier.type,
      });
    }
  });
  return notifiersTypeOptions;
};

export const getContactPointSettings = (
  notifierOptions: ContactNotifierType['options'],
  selectedData: { [key: string]: any },
): {
  settings: { [key: string]: any };
  secureSettings: { [key: string]: any };
} => {
  const settings: { [key: string]: any } = {};
  const secureSettings: { [key: string]: any } = {};
  notifierOptions.forEach((option) => {
    if (selectedData[option.propertyName]) {
      if (option.secure) {
        secureSettings[option.propertyName] = selectedData[option.propertyName];
      } else {
        settings[option.propertyName] = selectedData[option.propertyName];
      }
    }
  });

  return { settings, secureSettings };
};

export const validateContactRequiredFields = ({
  getNotifierData,
  selectedNotifierData,
  selectedNotifierTypes,
}: {
  getNotifierData: (notifierType: string) => ContactNotifierType;
  selectedNotifierTypes: string[];
  selectedNotifierData: Array<{ [key: string]: string }>;
}): boolean => {
  let isValid = true;
  selectedNotifierTypes.forEach((notifierType, index) => {
    const { options } = getNotifierData(notifierType);
    const selectedData = selectedNotifierData[index];
    options.forEach((option) => {
      if (option.required && !selectedData[option.propertyName]) {
        isValid = false;
      }
    });
  });
  return isValid;
};
