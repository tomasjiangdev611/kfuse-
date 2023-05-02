import { AutocompleteOption } from 'components';
import delimiter from './delimiter';
export const CoreLevelLabel = {
  component: 'Core',
  name: 'level',
  type: 'string',
};

export const CoreSourceLabel = {
  component: 'Core',
  name: 'source',
  type: 'string',
};

export const CoreLabels = [CoreLevelLabel, CoreSourceLabel];

export const CloudLabels = [
  { component: 'Cloud', name: 'availability_zone', type: 'string' },
  { component: 'Cloud', name: 'cluster_name', type: 'string' },
  { component: 'Cloud', name: 'instance_id', type: 'string' },
  { component: 'Cloud', name: 'instance_type', type: 'string' },
  { component: 'Cloud', name: 'project', type: 'string' },
];

export const KubernetesLabels = [
  { component: 'Kubernetes', name: 'docker_image', type: 'string' },
  { component: 'Kubernetes', name: 'host', type: 'string' },
  { component: 'Kubernetes', name: 'kube_container_name', type: 'string' },
  { component: 'Kubernetes', name: 'kube_namespace', type: 'string' },
  { component: 'Kubernetes', name: 'kube_service', type: 'string' },
  { component: 'Kubernetes', name: 'pod_name', type: 'string' },
];

export const getCoreCloudKubernetesLabels = () => [
  ...CoreLabels,
  ...CloudLabels,
  ...KubernetesLabels,
];

export const getCoreCloudKubernetesOptions = (): AutocompleteOption[] => {
  const labels = getCoreCloudKubernetesLabels();

  return labels.map((label) => ({
    label: `${label.component}:${label.name}`,
    value: `${label.component}${delimiter}${label.name}${delimiter}${label.type}`,
  }));
};

const createBitmap = (labels) =>
  labels.reduce((obj, label) => ({ ...obj, [label.name]: label }), {});

export const CoreLabelsBitmap = createBitmap(CoreLabels);
export const CloudLabelsBitmap = createBitmap(CloudLabels);
export const KubernetesLabelsBitmap = createBitmap(KubernetesLabels);

export const eventsFacets = [
  'aggregation_key',
  'alert_type',
  'event_type',
  'host',
  'id',
  'priority',
  'source_type_name',
  'text',
  'title',
];

export const AlertsStatusLabels = [
  { label: 'Alerting', value: 'alerting' },
  { label: 'OK', value: 'ok' },
  { label: 'No Data', value: 'no_data' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paused', value: 'paused' },
];
