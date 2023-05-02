import {
  AlertsCreateDetailsProps,
  AlertsEvaluateProps,
  ConditionProps,
} from '../types';

export const alertsCreateValidateForm = (
  details: AlertsCreateDetailsProps,
  evaluate: AlertsEvaluateProps,
  condition: ConditionProps,
  addToast: (val: { text: string; status: string }) => void,
): boolean => {
  const { ruleName, folderName, groupName } = details;
  if (!ruleName || !folderName || !groupName) {
    addToast({ text: 'Please fill all the required fields', status: 'error' });
    return false;
  }

  if (condition.valueError) {
    addToast({ text: 'Condition value is not valid', status: 'error' });
    return false;
  }
  if (!condition.value) {
    addToast({ text: 'Condition value is required', status: 'error' });
    return false;
  }

  if (!evaluate.for || !evaluate.every) {
    addToast({ text: 'Evaluate cannot be empty', status: 'error' });
  }
  return true;
};

export const validateMetricName = (
  name: string,
  addToast: (val: { text: string; status: string }) => void,
): boolean => {
  const metricNameValidatorRegex = /^[a-zA-Z0-9_]+$/;
  if (name.trim() === '') {
    addToast({
      text: 'Please fill Metric Name',
      status: 'error',
    });
    return false;
  }
  if (!metricNameValidatorRegex.test(name)) {
    addToast({
      text: 'Metric name should only contain alphanumeric characters and underscores.',
      status: 'error',
    });
    return false;
  }
  return true;
};
