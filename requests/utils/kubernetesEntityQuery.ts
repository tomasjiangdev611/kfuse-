export const pods = `pod {
    ip
    nominatedNodeName
    phase
    nodeName
    status
    tags
    qosClass
    priorityClass
    initContainerStatuses {
      containerID
      name
      ready
      restartCount
      state
    }
    containerStatuses {
      ready
      restartCount
      name
    }
    resourceRequirements {
      limits
      requests
    }
    metadata {
      labels
      name
      namespace
      annotations
      creationTimestamp
    }
  }`;

export const cluster = ` cluster{
    nodeCount
    kubeletVersions
    apiServerVersions
    podCapacity
    podAllocatable
    memoryAllocatable
    memoryCapacity
    cpuAllocatable
    cpuCapacity
    resourceVersion
    creationTimestamp
    tags
    clusterName
    id
  }`;

export const namespace = `namespace{
    metadata{
      name
      namespace
      creationTimestamp
      uid
      labels
      annotations
      ownerReferences{
        name
        uid
        kind
      }
      resourceVersion
    }
    status
    conditionMessage
    tags
  }`;

export const node = `node{
    metadata{
    name
    namespace
      creationTimestamp
      labels
      annotations
      ownerReferences{
        name
        kind
        uid
      }
      resourceVersion
      finalizers
  }
    podCIDR
    podCIDRs
    unschedulable
    taints{
      key
      value
      effect
      timeAdded
    }
    status{
      capacity
      allocatable
      nodeAddresses
      status
      kubeletVersions
      conditions{
        type
        status
        lastTransitionTime
      }
      kubeProxyVersion
    }
    roles
    tags
    providerID
  }`;

export const deployment = `deployment{
    metadata{
      name
      namespace
      creationTimestamp
      labels
      uid
      ownerReferences{
        name
        uid
        kind
      }
      resourceVersion
    }
    replicas
    deploymentStrategy
    maxSurge
    paused
    selectors{
      key
      operator
      Values
    }
    replicas
    updatedReplicas
    readyReplicas
    availableReplicas
    unavailableReplicas
    tags
  }`;

export const replicaSet = ` replicaSet{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      labels
      annotations
      resourceVersion
    }
    replicas
    replicasDesired
    selectors{
      key
      operator
      Values
    }
    fullyLabeledReplicas
    readyReplicas
    availableReplicas
    resourceRequirements{
      limits
      requests
      name
    }
    tags
  }`;

export const jobs = `job{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      labels
      annotations
      resourceVersion
      ownerReferences{
        name
        uid
      }
    }
    spec{
      parallelism
      completions
      activeDeadlineSeconds
      backoffLimit
      manualSelector
      resourceRequirements{
        limits
        requests
        name
        type
      }
    }
    status{
      conditionMessage
      startTime
      completionTime
      active
      succeeded
      failed
    }
    tags
  }`;

export const cronJob = `cronJob{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      resourceVersion
      labels
      annotations
    }
    spec{
      schedule
      startingDeadlineSeconds
      concurrencyPolicy
      suspend
      successfulJobsHistoryLimit
      failedJobsHistoryLimit
      resourceRequirements{
        limits
        requests
        name
        type
      }
    }
    status{
      active{
        kind
        namespace
        name
        apiVersion
        apiVersion
        resourceVersion
        fieldPath
      }
      lastScheduleTime
    }
    tags
    
  }`;

export const daemonSet = `daemonSet{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      labels
      annotations
      resourceVersion
    }
    spec{
      selectors{
        key
        Values
      }
      deploymentStrategy
      maxUnavailable
      minReadySeconds
      revisionHistoryLimit
      resourceRequirements{
        limits
        requests
        name
        type
      }
    }
    status{
      currentNumberScheduled
      numberMisscheduled
      desiredNumberScheduled
      numberReady
      updatedNumberScheduled
      numberAvailable
      numberUnavailable
    }
    tags
    
  }`;

export const statefulSet = `
  statefulSet{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      resourceVersion
      annotations
      labels
    }
    spec{
      desiredReplicas
      serviceName
      podManagementPolicy
      updateStrategy
      partition
      selectors{
        key
        operator
        Values
      }
    }
    
    tags
    status{
      replicas
      readyReplicas
      currentReplicas
      updatedReplicas
    }
  }`;

export const service = `  service{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      resourceVersion
      labels
      annotations
    }
    spec{
      ports{
        name
        protocol
        port
        targetPort
        nodePort
      }
      clusterIp
      type
      externalIPs
      sessionAffinity
      loadBalancerIP
      loadBalancerSourceRanges
      externalName
      externalTrafficPolicy
      healthCheckNodePort
      publishNotReadyAddresses
      sessionAffinityConfig{
        clientIPTimeoutSeconds
      }
      ipFamily
    }
    status{
      loadBalancerIngress
    }
    tags
    
  }`;

export const ingress = `  ingress{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      labels
      annotations
      resourceVersion
    }
    spec{
      defaultBackend{
        service{
          serviceName
          portName
          portNumber
        }
        resource{
          apiGroup
          name
          kind
        }
      }
      tls{
        hosts
        secretName
      }
      rules{
        host
        httpPaths{
          path
          pathType
          backend{
            service{
              serviceName
              portName
              portNumber
            }
            resource{
              apiGroup
              name
            }
          }
        }
      }
      ingressClassName
    }
    status{
      ingress{
        ip
        hostname
        ports{
          port
          protocol
          error
        }
      }
    }
    tags
  }`;

export const persistentVolumeClaim = `  persistentVolumeClaim{
    metadata{
      name
      namespace
      creationTimestamp
      labels
      annotations
      resourceVersion
    }
    spec{
      accessModes
      resources{
        limits
        requests
        name
        type
      }
      volumeName
      storageClassName
      volumeMode
      dataSource{
        apiGroup
      }
    }
    status{
      phase
      accessModes
      capacity
      conditions{
        type
        status
        lastProbeTime
        lastTransitionTime
        reason
        message
      }
    }
    tags
  }`;

export const persistentVolume = ` persistentVolume{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      labels
      annotations
      resourceVersion
    }
    spec{
      capacity
      persistentVolumeType
      accessModes
      claimRef{
        namespace
        apiVersion
        resourceVersion
        fieldPath
      }
      persistentVolumeReclaimPolicy
      storageClassName
      mountOptions
      volumeMode
      nodeAffinity{
        matchExpressions{
          key
          operator
          Values
        }
        matchFields{
          key
          operator
          Values
        }
      }
    }
    status{
      phase
      message
      reason
    }
    tags
  }`;

export const role = ` role{
    metadata{
      name
      namespace
      uid
      creationTimestamp
      labels
      annotations
      resourceVersion
    }
    rules{
      verbs
      apiGroups
      resources
      resourceNames
      nonResourceURLs
    }
    
    tags
  }
`;

export const roleBinding = `roleBinding{
  metadata{
    name
    namespace
    uid
    creationTimestamp
    labels
    annotations
    resourceVersion
  }
  subjects{
    kind
    apiGroup
  }
  roleRef{
    apiGroup
  }
  
  tags
}`;

export const clusterRoleBinding = `clusterRoleBinding{
  metadata{
    name
    namespace
    uid
    creationTimestamp
    labels
    annotations
    resourceVersion
  }
  subjects{
    apiGroup
    kind
  }
  roleRef{
    apiGroup
    name
  }
  
  tags
}`;

export const clusterRole = `clusterRole{
  metadata{
    name
    namespace
    uid
    creationTimestamp
    labels
    annotations
    resourceVersion
  }
  rules{
    verbs
    apiGroups
    resources
    resourceNames
    nonResourceURLs
  }
  aggregationRules{
    key
    operator
    Values
  }
  
  tags
}`;

export const serviceAccount = `serviceAccount{
  metadata{
    name
    namespace
    uid
    creationTimestamp
    labels
    annotations
    resourceVersion
  }
  secrets{
    kind
    namespace
    name
    apiVersion
    resourceVersion
    fieldPath
  }
  automountServiceAccountToken
  
  tags
}`;

export const currentEntity = (entityType: string) => {
  switch (entityType) {
    case 'Pod':
      return pods;
    case 'Cluster':
      return cluster;
    case 'Node':
      return node;
    case 'Namespace':
      return namespace;
    case 'Ingress':
      return ingress;
    case 'Deployment':
      return deployment;
    case 'Service':
      return service;
    case 'ReplicaSet':
      return replicaSet;
    case 'PersistentVolumeClaim':
      return persistentVolumeClaim;
    case 'Job':
      return jobs;
    case 'PersistentVolume':
      return persistentVolume;
    case 'CronJob':
      return cronJob;
    case 'DaemonSet':
      return daemonSet;
    case 'StatefulSet':
      return statefulSet;
    case 'Role':
      return role;
    case 'RoleBinding':
      return roleBinding;
    case 'ClusterRole':
      return clusterRole;
    case 'ClusterRoleBinding':
      return clusterRoleBinding;
    case 'ServiceAccount':
      return serviceAccount;
  }
};
