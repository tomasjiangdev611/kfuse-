export type SLOProps = {
  alertsFile: string;
  alertUids: string[];
  annotations: any;
  budget: number;
  description: string;
  errorExpr: string;
  labels: any;
  name: string;
  rulesFile: string;
  service: string;
  statusErrorBudget?: {
    status: string;
    errorBudget: string;
    statusColor: string;
    errorBudgetColor: string;
    errorCount: number;
  };
  timeWindow: number;
  totalExpr: string;
};

export type SLOAlertInputProps = {
  Name: string;
  Labels: Array<{ Name: string; Value: string }>;
  Annotations: Array<{ Name: string; Value: string }>;
};

export type SLOAlertDataProps = {
  name: string;
  description: string;
  labels: Array<{ key: string; value: string }>;
  contactPoints: string[];
};

export type SLOFormProps = {
  sloName: string;
  sloDescription: string;
  objective: number;
  sloLabels: Array<{ key: string; value: string }>;
  high: SLOAlertDataProps;
  low: SLOAlertDataProps;
};
