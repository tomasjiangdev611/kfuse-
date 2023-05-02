type Format = {
  key: string;
  value: string;
  clickable: boolean;
  tags: boolean;
};

type KubernetesDetailsRow = {
  name: string;
  formats: Format[];
};

export const getKubernetesRightSideBarDetailsRows =
  (): KubernetesDetailsRow[] => [
    {
      name: 'Pod',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        { key: 'Node', value: 'kube_node', clickable: true, tags: true },
        {
          key: 'Deployment',
          value: 'kube_deployment',
          clickable: true,
          tags: true,
        },
        {
          key: 'Replica Set',
          value: 'kube_replica_set',
          clickable: true,
          tags: true,
        },
        { key: 'Service', value: 'kube_service', clickable: true, tags: true },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Ready',
          value: 'containerStatuses[0].ready',
          clickable: false,
          tags: false,
        },
        {
          key: 'Restarts',
          value: 'containerStatuses[0].restartCount',
          clickable: false,
          tags: false,
        },
        { key: 'IP', value: 'ip', clickable: false, tags: false },
        { key: 'QoS', value: 'kube_qos', clickable: false, tags: true },
      ],
    },
    {
      name: 'Cluster',
      formats: [
        {
          key: 'Api Server Version',
          value: 'apiServerVersions',
          clickable: false,
          tags: false,
        },
        {
          key: 'Kubelet Version',
          value: 'kubeletVersions',
          clickable: false,
          tags: false,
        },
        { key: 'Nodes', value: 'nodeCount', clickable: false, tags: false },
        { key: 'Namespaces', value: '', clickable: false, tags: false },
        {
          key: 'Deployment',
          value: '',
          clickable: false,
          tags: false,
        },
        { key: 'Pod', value: 'podCapacity', clickable: false, tags: false },
      ],
    },
    {
      name: 'Namespace',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Deployment',
          value: 'namespace-deployments',
          clickable: false,
          tags: false,
        },
        {
          key: 'Pods',
          value: 'namespace-pods',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'Node',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        { key: 'Role', value: 'roles', clickable: false, tags: false },
        {
          key: 'Version',
          value: 'status.kubeProxyVersion',
          clickable: false,
          tags: false,
        },
        {
          key: 'Internal IP',
          value: 'status.nodeAddresses.InternalIP',
          clickable: false,
          tags: false,
        },
        {
          key: 'Host',
          value: 'status.nodeAddresses.Hostname',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'Deployment',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Ready',
          value: 'readyReplicas/readyReplicas',
          clickable: false,
          tags: false,
        },
        {
          key: 'Up to date',
          value: 'updatedReplicas',
          clickable: false,
          tags: false,
        },
        {
          key: 'Available',
          value: 'availableReplicas',
          clickable: false,
          tags: false,
        },
        { key: 'Selector', value: 'selectors', clickable: false, tags: false },
      ],
    },
    {
      name: 'ReplicaSet',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Deployment',
          value: 'kube_deployment',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Current',
          value: 'readyReplicas',
          clickable: false,
          tags: false,
        },
        {
          key: 'Desired',
          value: 'replicasDesired',
          clickable: false,
          tags: false,
        },
        {
          key: 'Ready',
          value: 'availableReplicas',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'Job',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'metadata.namespace',
          clickable: true,
          tags: false,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Completions',
          value: 'spec.completions/status.active',
          clickable: false,
          tags: false,
        },
        {
          key: 'Parallelism',
          value: 'spec.parallelism',
          clickable: false,
          tags: false,
        },
        { key: 'Desired', value: '', clickable: false, tags: false },
        {
          key: 'Successful',
          value: 'status.succeeded',
          clickable: false,
          tags: false,
        },
        {
          key: 'Duration',
          value: '',
          clickable: false,
          tags: false,
        },
        {
          key: 'Timeline',
          value: '',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'CronJob',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'metadata.namespace',
          clickable: true,
          tags: false,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Schedule',
          value: 'spec.schedule',
          clickable: false,
          tags: false,
        },
        {
          key: 'Suspend',
          value: 'spec.suspend',
          clickable: false,
          tags: false,
        },
        {
          key: 'Last Schedule',
          value: 'status.lastScheduleTime',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'DaemonSet',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Deployment Strategy',
          value: 'spec.deploymentStrategy',
          clickable: false,
          tags: false,
        },
        { key: 'Selectors', value: '', clickable: false, tags: false },
        {
          key: 'Current/Desired',
          value: 'status.currentNumberScheduled/status.desiredNumberScheduled',
          clickable: false,
          tags: false,
        },
        {
          key: 'Ready',
          value: 'status.numberReady',
          clickable: false,
          tags: false,
        },
        {
          key: 'Updated',
          value: 'status.updatedNumberScheduled',
          clickable: false,
          tags: false,
        },
        {
          key: 'Available',
          value: 'status.numberAvailable',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'StatefulSet',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Current/Desired',
          value: 'status.currentReplicas/spec.desiredReplicas',
          clickable: false,
          tags: false,
        },
        {
          key: 'Ready',
          value: 'status.readyReplicas',
          clickable: false,
          tags: false,
        },
        {
          key: 'Updated',
          value: 'status.updatedReplicas',
          clickable: false,
          tags: false,
        },
        {
          key: 'Service',
          value: 'spec.serviceName',
          clickable: false,
          tags: false,
        },
        {
          key: 'Selectors',
          value: 'kube_stateful_set',
          clickable: false,
          tags: true,
        },
        {
          key: 'Pod Management Policy',
          value: 'spec.podManagementPolicy',
          clickable: false,
          tags: false,
        },
        {
          key: 'Update Strategy',
          value: 'spec.updateStrategy',
          clickable: false,
          tags: false,
        },
        {
          key: 'Partition',
          value: 'spec.partition',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'Service',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Type',
          value: 'spec.type',
          clickable: false,
          tags: false,
        },
        {
          key: 'Cluster IP',
          value: 'spec.clusterIp',
          clickable: false,
          tags: false,
        },
        {
          key: 'External IPs',
          value: 'spec.externalIPs',
          clickable: false,
          tags: false,
        },
        {
          key: 'Ports',
          value: 'name-port/protocol',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'Ingress',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Class Name',
          value: 'spec.ingressClassName',
          clickable: false,
          tags: false,
        },
        {
          key: 'Load Balancer',
          value: '',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'PersistentVolumeClaim',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Persistent Volume',
          value: 'kube_persistent_volume',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Class',
          value: 'kube_storage_class_name',
          clickable: false,
          tags: true,
        },
        {
          key: 'Storage Capacity',
          value: 'status.capacity.storage',
          clickable: false,
          tags: false,
        },
        {
          key: 'Capacity Requests',
          value: 'spec.resources.requests.storage',
          clickable: false,
          tags: false,
        },
        {
          key: 'Capacity Limits',
          value: '',
          clickable: false,
          tags: false,
        },
        {
          key: 'Desired Access Modes',
          value: 'spec.accessModes',
          clickable: false,
          tags: false,
        },
        {
          key: 'Current Access Modes',
          value: 'status.accessModes',
          clickable: false,
          tags: false,
        },
        {
          key: 'Volume Mode',
          value: 'spec.volumeMode',
          clickable: false,
          tags: false,
        },
        {
          key: 'Finalizers',
          value: 'metadata.annotations[0]',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'PersistentVolume',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Type',
          value: 'spec.persistentVolumeType',
          clickable: false,
          tags: false,
        },
        {
          key: 'Class',
          value: 'kube_storage_class_name',
          clickable: false,
          tags: true,
        },
        {
          key: 'Storage Capacity',
          value: 'spec.capacity.storage',
          clickable: false,
          tags: false,
        },
        {
          key: 'Access Modes',
          value: 'spec.accessModes',
          clickable: false,
          tags: false,
        },
        {
          key: 'Volume Mode',
          value: 'spec.volumeMode',
          clickable: false,
          tags: false,
        },
        {
          key: 'Reclaim Policy',
          value: 'spec.persistentVolumeReclaimPolicy',
          clickable: false,
          tags: false,
        },
        {
          key: 'Finalizers',
          value: 'metadata.annotations[0]',
          clickable: false,
          tags: false,
        },
        {
          key: 'Selectors',
          value: 'spec.selectors',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'Role',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'RoleBinding',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Role',
          value: 'kube_role_binding',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Role Name',
          value: 'kube_role_binding',
          clickable: false,
          tags: true,
        },
        {
          key: 'Role Kind',
          value: 'subjects[0].kind',
          clickable: false,
          tags: false,
        },
        {
          key: 'API Group',
          value: 'roleRef.apiGroup',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'ClusterRole',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'ClusterRoleBinding',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Cluster Role',
          value: 'kube_cluster_role',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        {
          key: 'Role Kind',
          value: 'subjects[0].kind',
          clickable: false,
          tags: false,
        },
        {
          key: 'API Group',
          value: 'subjects[0].apiGroup',
          clickable: false,
          tags: false,
        },
      ],
    },
    {
      name: 'ServiceAccount',
      formats: [
        {
          key: 'Cluster',
          value: 'kube_cluster_name',
          clickable: true,
          tags: true,
        },
        {
          key: 'Namespace',
          value: 'kube_namespace',
          clickable: true,
          tags: true,
        },
        {
          key: 'Age',
          value: 'creationTimestamp',
          clickable: false,
          tags: false,
        },
        { key: 'Secrets', value: 'secrets', clickable: false, tags: false },
        {
          key: 'Automount Token',
          value: 'automountServiceAccountToken',
          clickable: false,
          tags: false,
        },
      ],
    },
  ];
