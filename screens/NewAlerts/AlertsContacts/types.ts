export type ReceiverConfigProps = {
  disableResolveMessage: boolean;
  name: string;
  settings: { [key: string]: any };
  secureSettings: { [key: string]: any };
  type: string;
  uid?: string;
};

export type ReceiverProps = {
  grafana_managed_receiver_configs: ReceiverConfigProps[];
  name: string;
};

export type ContactNotifierType = {
  description: string;
  heading: string;
  info: string;
  name: string;
  options: ContactNotifierTypeOptions[];
  type: string;
};

export type ContactNotifierTypeOptions = {
  dependsOn: string;
  description: string;
  element: string;
  inputType: string;
  label: string;
  placeholder: string;
  propertyName: string;
  required: boolean;
  secure: boolean;
  selectOptions: Array<{ label: string; value: string }>;
  showWhen: { filed: string; is: string };
  validationRule: string;
};
