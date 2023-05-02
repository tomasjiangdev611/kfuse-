import { DateSelection } from 'types/DateSelection';

export type ConditionProps = {
  of: string;
  queryKey?: string;
  value?: string;
  valueError?: string;
  valueRange?: { min: string; max: string };
  when: string;
};

export type MetricChangeConditionProps = {
  change?: string;
  time?: string;
  comparedTime?: string;
};

export type OutlierConditionProps = {
  algorithm: string;
  tolerance?: string;
};

export type AnomalyConditionProps = {
  anomalyAlgorithm: string;
  globalHistory?: string;
  localHistory?: string;
  metricName?: string;
  x?: string;
  y?: string;
  step?: string;
  window?: string;
  bound?: string;
  band?: string;
};

export type AlertsCreateDetailsProps = {
  description?: string;
  folderName: string;
  groupName: string;
  ruleName: string;
  runbookUrl?: string;
  query?: string;
  summary?: string;
  tags?: string[];
  uid?: string;
};

export type AlertsEvaluateProps = {
  every: string;
  for: string;
};

export type RuleProps = {
  annotations?: { [key: string]: string };
  datasourceUid?: string;
  evaluate?: { for: string; every: string };
  contactPointLabels?: string[];
  group: string;
  groupFile: string;
  labels?: { [key: string]: string };
  mute?: { status: boolean; muteId?: string };
  name: string;
  ruleData?: Array<any>;
  status: string;
  tags?: string[];
  uid: string;
  updated: string;
};

export type MutateAlertsFunctionProps = {
  condition: ConditionProps;
  datasourceType: 'prometheus' | 'loki';
  date: DateSelection;
  promqlQuery: string;
  ruleAnnotations: { alertType?: string; ruleType: string; extraData?: string };
};
