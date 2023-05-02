import { Table } from 'components';
import { useColorsByServiceName, useDateState, useRequest } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { KpisByFunctionName } from 'screens/Serverless/types';
import ViewRelatedContainersTable from './ViewRelatedTables/ViewRelatedContainersTable';
import { useKubesState } from './hooks';
import { queryRange, kubeNamespaceCount, kubeFacetCount } from 'requests';
import {
  KubernetesReplicaSetTable,
  KubernetesPodTable,
  KubernetesNodeTable,
  KubernetesNamespaceTable,
  KubernetesJobTable,
  KubernetesDeploymentTable,
  KubernetesDaemonSetTable,
  KubernetesCronJobTable,
  KubernetesClusterTable,
  KubernetesStatefulSetTable,
  KubernetesIngressTable,
  KubernetesServiceTable,
  KubernetesPersistentVolumeClaimTable,
  KubernetesPersistentVolumeTable,
  KubernetesRoleTable,
  KubernetesRoleBindingTable,
  KubernetesClusterRoleTable,
  KubernetesClusterRoleBindingTable,
  KubernetesServiceAccountTable,
} from './KubernetesTables';

const getRows = (kpisByFunctionName: any) => {
  return Object.keys(kpisByFunctionName).map((functionName) => ({
    name: functionName,
    ...kpisByFunctionName[functionName],
  }));
};

type Props = {
  colorsByFunctionName: ReturnType<typeof useColorsByServiceName>;
  kpisByFunctionName: KpisByFunctionName;
  viewRelatedEntity: string;
  kubesState: ReturnType<typeof useKubesState>;
};

const ViewRelatedTable = ({
  colorsByFunctionName,
  kpisByFunctionName,
  viewRelatedEntity,
  kubesState,
}: Props) => {
  const rows = useMemo(() => getRows(kpisByFunctionName), [kpisByFunctionName]);

  const setActiveFunctionNameHandler = (row: any) => () => {
    window.open(
      `#/kubernetes` +
        `?entity=${viewRelatedEntity}&activeKube=${JSON.stringify(row)}`,
      '_blank',
    );
  };

  const { setFilterByFacets, selectedFacetValuesByNameState } = kubesState;
  const podsCount = useRequest(kubeNamespaceCount);
  const deploymentsCount = useRequest(kubeNamespaceCount);
  const [date, setDate] = useDateState();
  const daemonSetCount = useRequest(kubeNamespaceCount);
  const cronjobsCount = useRequest(kubeNamespaceCount);
  const statefullSetCount = useRequest(kubeNamespaceCount);
  const [podCpuUsageData, setPodCpuUsageData] = useState();
  const [podMemUsageData, setPodMemUsageData] = useState();
  const [namespaceCpuUsageData, setNamespaceCpuUsageData] = useState();
  const [namespaceMemUsageData, setNamespaceMemUsageData] = useState();
  const [activeColumn, setActiveColumn] = useState();
  const [sortordr, setSortOrdr] = useState();
  const [clusterCpuUsageData, setClusterCpuUsageData] = useState();
  const [clusterMemUsageData, setClusterMemUsageData] = useState();
  const [namespaceCPUUtilized, setNamespaceCPUUtilized] = useState();
  const [namespaceMemUtilized, setNamespaceMemUtilized] = useState();
  const [clusterPodCount, setClusterPodCount] = useState();
  const [nodesCpuUsageData, setNodesCpuUsageData] = useState();
  const [nodesMemUsageData, setNodesMemUsageData] = useState();
  const [nodesCpuPercentageData, setNodesCpuPercentageData] = useState();
  const [nodesMemPercentageData, setNodesMemPercentageData] = useState();

  const podMemUsage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (pod_name, kube_cluster_name, kube_namespace) (avg_over_time(container_memory_usage[1m]))/ sum by (pod_name, kube_cluster_name, kube_namespace) (avg_over_time(container_memory_limit[1m]))',
    }).then((output) => {
      setPodMemUsageData(output);
    });
  };

  const podCPUUsage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (pod_name, kube_cluster_name, kube_namespace) (avg_over_time(container_cpu_usage[1m]))/ sum by (pod_name, kube_cluster_name, kube_namespace) (avg_over_time(container_cpu_limit[1m]))',
    }).then((output) => {
      setPodCpuUsageData(output);
    });
  };

  const clusterMemUsage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (kube_cluster_name) (avg_over_time(container_memory_usage[1m]))',
    }).then((output) => {
      setClusterMemUsageData(output);
    });
  };

  const clusterCPUUsage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (kube_cluster_name) (avg_over_time(container_cpu_usage[1m]))/1000000',
    }).then((output) => {
      setClusterCpuUsageData(output);
    });
  };

  const nodesMemUsage = async () => {
    queryRange({
      date,
      instant: true,
      query: 'sum by (kube_node) (avg_over_time(container_memory_usage[1m]))',
    }).then((output) => {
      setNodesMemUsageData(output);
    });
  };

  const nodesCPUUsage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (kube_node) (avg_over_time(container_cpu_usage[1m]))/1000000',
    }).then((output) => {
      setNodesCpuUsageData(output);
    });
  };

  const nodesMemPercentage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (host) (avg_over_time(container_cpu_usage[1m]))/ sum by (host) (avg_over_time(container_cpu_limit[1m]))',
    }).then((output) => {
      setNodesMemPercentageData(output);
    });
  };

  const nodesCPUPercentage = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (host) (avg_over_time(container_memory_usage[1m]))/ sum by (host) (avg_over_time(container_memory_limit[1m]))',
    }).then((output) => {
      setNodesCpuPercentageData(output);
    });
  };

  const namespaceCPUallocation = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (kube_cluster_name, kube_namespace) (avg_over_time(container_cpu_usage[1m]))',
    }).then((output) => {
      setNamespaceCPUUtilized(output);
    });
  };

  const namespaceMEMallocation = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (kube_cluster_name, kube_namespace) (avg_over_time(container_memory_usage[1m]))',
    }).then((output) => {
      setNamespaceMemUtilized(output);
    });
  };

  const namespacePODallocation = async () => {
    queryRange({
      date,
      instant: true,
      query:
        'sum by (pod_name, kube_cluster_name, kube_namespace) (avg_over_time(container_cpu_usage[1m]))',
    }).then((output) => {
      setNamespaceMemUtilized(output);
    });
  };
  const getClusterPodCountQueryRangeRequest = useRequest(kubeFacetCount);
  const cpuUsagePercentQueryRangeRequest = useRequest(podCPUUsage);
  const memUsageQueryRangeRequest = useRequest(podMemUsage);
  const clusterCpuUsagePercentQueryRangeRequest = useRequest(clusterCPUUsage);
  const clusterMemUsageQueryRangeRequest = useRequest(clusterMemUsage);
  const namespaceCPUAllocationQueryRangeRequest = useRequest(
    namespaceCPUallocation,
  );
  const namespaceMemAllocationQueryRangeRequest = useRequest(
    namespaceMEMallocation,
  );
  const namespacePODAllocationQueryRangeRequest = useRequest(
    namespacePODallocation,
  );
  const nodesCPUUsageRequest = useRequest(nodesCPUUsage);
  const nodesCPUPercentageRequest = useRequest(nodesCPUPercentage);
  const nodesMemUsageRequest = useRequest(nodesMemUsage);
  const nodesMemPercentageRequest = useRequest(nodesMemPercentage);

  useEffect(() => {
    setActiveColumn('');
    if (viewRelatedEntity === 'Namespace') {
      podsCount.call({ entityType: 'Pod', groupKey: 'kube_namespace' });
      deploymentsCount.call({
        entityType: 'Deployment',
        groupKey: 'kube_namespace',
      });
      daemonSetCount.call({
        entityType: 'DaemonSet',
        groupKey: 'kube_namespace',
      });
      cronjobsCount.call({ entityType: 'CronJob', groupKey: 'kube_namespace' });
      statefullSetCount.call({
        entityType: 'StatefulSet',
        groupKey: 'kube_namespace',
      });
      namespaceCPUAllocationQueryRangeRequest.call({});
      namespaceMemAllocationQueryRangeRequest.call({});
    }
    if (viewRelatedEntity === 'Pod') {
      cpuUsagePercentQueryRangeRequest.call({});
      memUsageQueryRangeRequest.call({});
    }
    if (viewRelatedEntity === 'Cluster') {
      clusterCpuUsagePercentQueryRangeRequest.call({});
      clusterMemUsageQueryRangeRequest.call({});
      getClusterPodCountQueryRangeRequest.call({
        entityType: 'Pod',
        tags: 'kube_cluster_name',
        selectedFacetValuesByName: {
          ...selectedFacetValuesByNameState.state,
        },
        filterByFacets: kubesState.filterByFacets,
      });
    }
    if (viewRelatedEntity === 'Node') {
      nodesCPUUsageRequest.call({});
      nodesCPUPercentageRequest.call({});
      nodesMemUsageRequest.call({});
      nodesMemPercentageRequest.call({});
    }
  }, [viewRelatedEntity]);

  useEffect(() => {
    if (getClusterPodCountQueryRangeRequest.result)
      setClusterPodCount(getClusterPodCountQueryRangeRequest.result);
  }, [getClusterPodCountQueryRangeRequest.result]);

  const filterCluster = (entity: string, row: any) => () => {
    const kubeClusterName = row?.tags.find((element) => {
      return element.includes('kube_cluster_name');
    });
    const filterCondition = kubeClusterName.replace(':', '=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${filterCondition}`]: true,
      };
    });
  };

  const filterNamespace = (entity: string, row: any) => () => {
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${'kube_namespace'}=${row?.metadata?.namespace}`]: true,
      };
    });
  };

  const filterDeployment = (entity: string, row: any) => () => {
    const kubeDeplymentName = row?.tags.find((element) => {
      return element.includes('kube_deployment');
    });
    const filterCondition = kubeDeplymentName.replace(':', '=');
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${filterCondition}`]: true,
      };
    });
  };

  const filterService = (entity: string, row: any) => () => {
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${'kube_service'}=${row?.spec?.serviceName}`]: true,
      };
    });
  };

  const filterPersistentVolume = (entity: string, row: any) => () => {
    setFilterByFacets((prevState) => {
      return {
        ...prevState,
        [`${'kube_persistent_volume'}=${row?.spec?.volumeName}`]: true,
      };
    });
  };

  const getTableBasedOnEnitityType = () => {
    switch (viewRelatedEntity) {
      case 'Pod':
        return KubernetesPodTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
          podCpuUsageData,
          podMemUsageData,
        );
      case 'Containers':
        return ViewRelatedContainersTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
        );
      case 'Cluster':
        return KubernetesClusterTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          clusterPodCount,
          clusterCpuUsageData,
          clusterMemUsageData,
        );
      case 'Node':
        return KubernetesNodeTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          nodesCpuUsageData,
          nodesCpuPercentageData,
          nodesMemUsageData,
          nodesMemPercentageData,
        );
      case 'Namespace':
        return KubernetesNamespaceTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          podsCount.result,
          deploymentsCount.result,
          daemonSetCount.result,
          cronjobsCount.result,
          statefullSetCount.result,
          namespaceCPUUtilized,
          namespaceMemUtilized,
        );
      case 'Deployment':
        return KubernetesDeploymentTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'ReplicaSet':
        return KubernetesReplicaSetTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
          filterDeployment,
        );
      case 'Service':
        return KubernetesServiceTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
        );
      case 'Job':
        return KubernetesJobTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'PersistentVolume':
        return KubernetesPersistentVolumeTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
        );
      case 'CronJob':
        return KubernetesCronJobTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'DaemonSet':
        return KubernetesDaemonSetTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'StatefulSet':
        return KubernetesStatefulSetTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
          filterService,
        );
      case 'PersistentVolumeClaim':
        return KubernetesPersistentVolumeClaimTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
          filterPersistentVolume,
        );
      case 'Ingress':
        return KubernetesIngressTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'Role':
        return KubernetesRoleTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'RoleBinding':
        return KubernetesRoleBindingTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
      case 'ClusterRole':
        return KubernetesClusterRoleTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
        );
      case 'ClusterRoleBinding':
        return KubernetesClusterRoleBindingTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
        );
      case 'ServiceAccount':
        return KubernetesServiceAccountTable(
          colorsByFunctionName,
          setActiveFunctionNameHandler,
          filterCluster,
          filterNamespace,
        );
    }
  };
  return (
    <Table
      className="kubernetes__table__table"
      columns={getTableBasedOnEnitityType()}
      isSortingEnabled
      rows={rows}
    />
  );
};

export default ViewRelatedTable;
