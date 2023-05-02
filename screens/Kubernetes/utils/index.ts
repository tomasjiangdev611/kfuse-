export const facetNames = {
  Kubernetes: [
    { key: 'Pod', label: 'Pods' },
    { key: 'Cluster', label: 'Clusters' },
    { key: 'Namespace', label: 'Namespaces' },
    { key: 'Node', label: 'Nodes' },
    {
      Workloads: [
        { key: 'Deployment', label: 'Deployments' },
        { key: 'ReplicaSet', label: 'Replica Sets' },
        { key: 'Job', label: 'Jobs' },
        { key: 'CronJob', label: 'Cron Jobs' },
        { key: 'DaemonSet', label: 'Daemon Sets' },
        { key: 'StatefulSet', label: 'Stateful Sets' },
      ],
    },
    {
      Network: [
        { key: 'Service', label: 'Services' },
        { key: 'Ingress', label: 'Ingresses' },
      ],
    },
    {
      Storage: [
        { key: 'PersistentVolumeClaim', label: 'Persistent Volume Claims' },
        { key: 'PersistentVolume', label: 'Persistent Volumes' },
      ],
    },
    {
      'Access Control': [
        { key: 'Role', label: 'Roles' },
        { key: 'RoleBinding', label: 'Role Bindings' },
        { key: 'ClusterRole', label: 'Cluster Roles' },
        { key: 'ClusterRoleBinding', label: 'Cluster Role Bindings' },
        { key: 'ServiceAccount', label: 'Service Accounts' },
      ],
    },
  ],
};

export const monokai = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

export const getEntitiyDropdowndata = (entityType: string) => {
  let options;
  if (entityType === 'Pod') {
    return (options = [
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Nodes', value: 'Node' },
      { label: 'Deployments', value: 'Deployment' },
      { label: 'Replica Sets', value: 'ReplicaSet' },
      { label: 'Services', value: 'Service' },
      { label: 'Jobs', value: 'Job' },
      { label: 'Cron Jobs', value: 'CronJob' },
      { label: 'Daemon Sets', value: 'DaemonSet' },
      { label: 'Stateful Sets', value: 'StatefulSet' },
    ]);
  } else if (entityType === 'Cluster') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Nodes', value: 'Node' },
      { label: 'Deployments', value: 'Deployment' },
      { label: 'Replica Sets', value: 'ReplicaSet' },
      { label: 'Services', value: 'Service' },
      { label: 'Jobs', value: 'Job' },
      { label: 'Cron Jobs', value: 'CronJob' },
      { label: 'Daemon Sets', value: 'DaemonSet' },
      { label: 'Stateful Sets', value: 'StatefulSet' },
      { label: 'Persistent Volume Claims', value: 'PersistentVolumeClaim' },
      { label: 'Persistent Volumes', value: 'PersistentVolume' },
      { label: 'Roles', value: 'Role' },
      { label: 'Role Bindings', value: 'RoleBinding' },
      { label: 'Cluster Roles', value: 'ClusterRole' },
      { label: 'Cluster Role Bindings', value: 'ClusterRoleBinding' },
      { label: 'Service Accounts', value: 'ServiceAccount' },
      { label: 'Ingresses', value: 'Ingress' },
    ]);
  } else if (entityType === 'Namespace') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Deployments', value: 'Deployment' },
      { label: 'Replica Sets', value: 'ReplicaSet' },
      { label: 'Services', value: 'Service' },
      { label: 'Jobs', value: 'Job' },
      { label: 'Cron Jobs', value: 'CronJob' },
      { label: 'Daemon Sets', value: 'DaemonSet' },
      { label: 'Stateful Sets', value: 'StatefulSet' },
      { label: 'Persistent Volume Claims', value: 'PersistentVolumeClaim' },
      { label: 'Roles', value: 'Role' },
      { label: 'Role Bindings', value: 'RoleBinding' },
      { label: 'Service Accounts', value: 'ServiceAccount' },
      { label: 'Ingresses', value: 'Ingress' },
    ]);
  } else if (entityType === 'Node') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
    ]);
  } else if (entityType === 'Deployment') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Replica Sets', value: 'ReplicaSet' },
    ]);
  } else if (entityType === 'ReplicaSet') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Deployments', value: 'Deployment' },
    ]);
  } else if (entityType === 'Job') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Cron Jobs', value: 'CronJob' },
    ]);
  } else if (entityType === 'CronJob') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Jobs', value: 'Job' },
    ]);
  } else if (entityType === 'DaemonSet') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
    ]);
  } else if (entityType === 'StatefulSet') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
    ]);
  } else if (entityType === 'Service') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Deployments', value: 'Deployment' },
      { label: 'Replica Sets', value: 'ReplicaSet' },
    ]);
  } else if (entityType === 'Ingress') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Services', value: 'Service' },
    ]);
  } else if (entityType === 'PersistentVolumeClaim') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Persistent Volumes', value: 'PersistentVolume' },
    ]);
  } else if (entityType === 'PersistentVolume') {
    return (options = [
      { label: 'Pods', value: 'Pod' },
      { label: 'Clusters', value: 'Cluster' },
      { label: 'Namespaces', value: 'Namespace' },
      { label: 'Persistent Volume Claims', value: 'PersistentVolumeClaim' },
    ]);
  }
};

export const facet_pod = [
  { key: 'pod_status', label: 'Status' },
  { key: 'pod_phase', label: 'Phase' },
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_service', label: 'Service' },
  { key: 'kube_deployment', label: 'Deployment' },
  { key: 'kube_replica_set', label: 'Replica Set' },
  { key: 'pod_name', label: 'Pod' },
  { key: 'kube_node', label: 'Node' },
];
export const facet_cluster = [
  { key: 'kube_cluster_name', label: 'Cluster name' },
];
export const facet_namespace = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
];
export const facet_node = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_node', label: 'Node' },
  { key: 'node_schedulable', label: 'Schedulable' },
  { key: 'node_status', label: 'Status' },
];
export const facet_deployment = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_deployment', label: 'Deployment' },
  { key: 'kube_namespace', label: 'Namespace' },
];
export const facet_replicaset = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_deployment', label: 'Deployment' },
  { key: 'kube_replica_set', label: 'Replica set' },
  { key: 'kube_namespace', label: 'Namespace' },
];
export const facet_job = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_cron_job', label: 'Cron Job' },
  { key: 'kube_job', label: 'Job' },
];
export const facet_cronjob = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_cron_job', label: 'Cron Job' },
];
export const facet_daemonset = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_daemon_set', label: 'Daemon Set' },
  { key: 'kube_namespace', label: 'Namespace' },
];
export const facet_statefulset = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_prometheus', label: 'Prometheus' },
  { key: 'kube_stateful_set', label: 'StatefulSet' },
];
export const facet_service = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_prometheus', label: 'Prometheus' },
  { key: 'kube_service', label: 'Service' },
  { key: 'kube_service_type', label: 'Service Type' },
];
export const facet_ingress = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
];
export const facet_persistentvolumeclaim = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_persistent_volume', label: 'Persistent Volume' },
  { key: 'kube_storage_class_name', label: 'Storage Class Name' },
  { key: 'persistentvolumeclaim', label: 'Persistent Volume Claim' },
  { key: 'pvc_phase', label: 'Phase' },
];
export const facet_persistentvolume = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_persistent_volume', label: 'Persistent Volume' },
  { key: 'kube_reclaim_policy', label: 'Reclaim Policy' },
  { key: 'kube_storage_class_name', label: 'Storage Class Name' },
  { key: 'persistentvolumeclaim', label: 'Persistent Volume Claim' },
  { key: 'pv_phase', label: 'Phase' },
  { key: 'pv_type', label: 'Type' },
];
export const facet_role = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_role', label: 'Role' },
];
export const facet_rolebinding = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_cluster_role', label: 'Cluster Role' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_role', label: 'Role' },
  { key: 'kube_role_binding', label: 'Role Binding' },
];
export const facet_clusterrole = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_cluster_role', label: 'Cluster Role' },
];
export const facet_clusterrolebinding = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_cluster_role', label: 'Cluster Role' },
  { key: 'kube_cluster_role_binding', label: 'Cluster Role Binding' },
];
export const facet_serviceaccount = [
  { key: 'kube_cluster_name', label: 'Cluster Name' },
  { key: 'kube_namespace', label: 'Namespace' },
  { key: 'kube_service_account', label: 'Service Account' },
];
