const groupByFacetName: { [key: string]: string } = {
  service_type: 'service',
  service_name: 'service',
  service_namespace: 'service',
  service_instance_id: 'service',
  service_version: 'service',

  language: 'telemetry SDK',
  version: 'telemetry SDK',
  name: 'telemetry SDK',

  container: 'kubernetes',
  kube_cluster_name: 'kubernetes',
  kube_deployment: 'kubernetes',
  kube_namespace: 'kubernetes',
  node: 'kubernetes',
  pod: 'kubernetes',
  pod_id: 'kubernetes',
  pod_name: 'kubernetes',
  type: 'kubernetes',

  availability_zone: 'cloud',
  account_id: 'cloud',
  hostname: 'cloud',
  platform: 'cloud',
  provider: 'cloud',
  region: 'cloud',

  endpoint: 'http',
  method: 'http',
  status_code: 'http',
};

const ungroupedFacetNamesBitmap = {
  component: 1,
  database: 1,
  error: 1,
  service_entry: 1,
  service_name: 1,
  span_name: 1,
  span_type: 1,
};

type FacetNamesByGroup = { [key: string]: string[] };

type Result = {
  facetNamesByGroup: FacetNamesByGroup;
  ungrouped: string[];
};

const groupTraceLabels = (result: string[]): Result => {
  const ungrouped: string[] = [];

  const facetNamesByGroup: FacetNamesByGroup = {};

  result.forEach((name) => {
    if (ungroupedFacetNamesBitmap[name]) {
      ungrouped.push(name);
    } else {
      const parts = name.split('.');
      if (parts.length === 1) {
        const group = groupByFacetName[name] || 'custom';
        if (!facetNamesByGroup[group]) {
          facetNamesByGroup[group] = [];
        }

        facetNamesByGroup[group].push(name);
      } else {
        const [group] = parts;
        if (!facetNamesByGroup[group]) {
          facetNamesByGroup[group] = [];
        }

        facetNamesByGroup[group].push(name);
      }
    }
  });

  return {
    facetNamesByGroup: Object.keys(facetNamesByGroup).reduce(
      (obj, group) => ({
        ...obj,
        [group]: facetNamesByGroup[group].sort(),
      }),
      {},
    ),
    ungrouped: ungrouped.sort(),
  };
};

export default groupTraceLabels;
