import {
  CloudLabels,
  CoreLabels,
  KubernetesLabels,
  delimiter,
} from 'constants';

export const getLabelWithDelimiter = (): string[] => {
  const labels = [...CoreLabels, ...KubernetesLabels, ...CloudLabels];
  const newlabels: string[] = [];
  labels.map(({ component, name, type }) => {
    newlabels.push(`${component}${delimiter}${name}${delimiter}${type}`);
  });
  return newlabels;
};
export const getAlertNamingConvention = (
  metric: string,
  rangeAggregate: string,
  ruleName: string,
  labelGrouping: string[],
): string => {
  let name = `kfuse__alerts__logs__`;
  if (metric === '*') {
    name += 'count_all_logs';
  } else {
    name += metric.replace(/:!:|:/g, '_');
  }
  name += `__${rangeAggregate}__`;
  if (labelGrouping.length > 0) {
    labelGrouping.forEach((label) => {
      if (label.charAt(0) === '@') {
        name += label.replace(/:|@/g, '_');
      }
    });
  }

  if (ruleName) {
    name += `_${ruleName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }
  return name;
};
