import { useRequest } from 'hooks';
import React, { useEffect } from 'react';
import Tree from 'react-d3-dag';
import { kubeRelatedResources } from 'requests';
import { DateSelection } from 'types';
import KubernetesRelatedResourcesMapNode from './KubernetesRelatedResourcesMapNode';

type Props = {
  colorsByEntityName: { [key: string]: string };
  date: DateSelection;
  entityType: string;
  row: any;
  entity: any;
};

const KubernetesRelatedResources = ({
  colorsByEntityName,
  date,
  entityType,
  row,
  entity,
}: Props) => {
  const relatedResourcesRequest = useRequest(kubeRelatedResources);
  useEffect(() => {
    relatedResourcesRequest.call({
      entityType: entityType,
    });
  }, []);

  const getTag = (prefix: string, name: string) => {
    const tag = entity.tags.find((string) => string.startsWith(prefix));
    if (tag) {
      const [, value] = tag.split(':');
      return {
        name,
        children: [],
        attributes: {
          entity_name: name,
          entity_value: value,
        },
      };
    } else {
      return {
        name,
        children: [],
        attributes: {
          entity_name: name,
          entity_value: '',
        },
      };
    }
  };

  const tree = [];
  const data = relatedResourcesRequest.result;

  if (data) {
    if (entityType == 'Pod') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const deployment = getTag('kube_deployment', 'Deployment');
      const service = getTag('kube_service', 'Service');
      const replicaSet = getTag('kube_replica_set', 'Replica Set');
      const node = getTag('kube_node', 'Node');
      const pod = getTag('pod_name', 'Pod');

      if (entityType == 'Pod') {
        service.children.push(pod);
        replicaSet.children.push(pod);
        node.children.push(pod);
        deployment.children.push(service);
        deployment.children.push(replicaSet);
        deployment.children.push(node);
        cluster.children.push(deployment);
        tree.push(cluster);
      }
    } else if (entityType == 'Deployment') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const deployment = getTag('kube_deployment', 'Deployment');
      const pod = getTag('kube_namespace', 'Pod');
      const replicaSet1 = getTag('kube_namespace', 'Replica Set');
      const replicaSet2 = getTag('kube_namespace', 'Replica Set');

      replicaSet1.children.push(pod);
      deployment.children.push(replicaSet1);
      deployment.children.push(replicaSet2);
      cluster.children.push(deployment);
      tree.push(cluster);
    } else if (entityType == 'ReplicaSet') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const deployment = getTag('kube_deployment', 'Deployment');
      const replicaSet = getTag('kube_replica_set', 'Replica Set');

      deployment.children.push(replicaSet);
      cluster.children.push(deployment);
      tree.push(cluster);
    } else if (entityType == 'CronJob') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const cronJob = getTag('kube_cron_job', 'Cron Job');

      cluster.children.push(cronJob);
      tree.push(cluster);
    } else if (entityType == 'DaemonSet') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const daemonSet = getTag('kube_daemon_set', 'Daemon Set');
      const pod = getTag('kube_namespace', 'Pod');

      daemonSet.children.push(pod);
      cluster.children.push(daemonSet);
      tree.push(cluster);
    } else if (entityType == 'StatefulSet') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const statefulSet = getTag('kube_stateful_set', 'Stateful Set');
      const pod = getTag('kube_namespace', 'Pod');

      statefulSet.children.push(pod);
      cluster.children.push(statefulSet);
      tree.push(cluster);
    } else if (entityType == 'Service') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const service = getTag('kube_service', 'Service');
      const pod = getTag('kube_namespace', 'Pod');

      service.children.push(pod);
      cluster.children.push(service);
      tree.push(cluster);
    } else if (entityType == 'PersistentVolumeClaim') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const persistentVolume = getTag(
        'kube_persistent_volume',
        'Persistent Volume',
      );
      const persistentVolumeClaim = getTag(
        'persistentvolumeclaim',
        'Persistent Volume Claim',
      );

      persistentVolume.children.push(persistentVolumeClaim);
      cluster.children.push(persistentVolume);
      tree.push(cluster);
    } else if (entityType == 'PersistentVolume') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const persistentVolume = getTag(
        'kube_persistent_volume',
        'Persistent Volume',
      );
      const persistentVolumeClaim = getTag(
        'persistentvolumeclaim',
        'Persistent Volume Claim',
      );

      persistentVolume.children.push(persistentVolumeClaim);
      cluster.children.push(persistentVolume);
      tree.push(cluster);
    } else if (entityType == 'Role') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const role = getTag('kube_role', 'Role');
      const roleBinding = getTag('kube_namespace', 'Role Binding');

      role.children.push(roleBinding);
      cluster.children.push(role);
      tree.push(cluster);
    } else if (entityType == 'RoleBinding') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const role = getTag('kube_role', 'Role');
      const roleBinding = getTag('kube_role_binding', 'Role Binding');

      role.children.push(roleBinding);
      cluster.children.push(role);
      tree.push(cluster);
    } else if (entityType == 'ClusterRole') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const clusterRole = getTag('kube_cluster_role', 'Cluster Role');
      const clusterRoleBinding = getTag(
        'kube_cluster_role',
        'Cluster Role Binding',
      );

      clusterRole.children.push(clusterRoleBinding);
      cluster.children.push(clusterRole);
      tree.push(cluster);
    } else if (entityType == 'ClusterRoleBinding') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const clusterRole = getTag('kube_cluster_role', 'Cluster Role');
      const clusterRoleBinding = getTag(
        'kube_cluster_role_binding',
        'Cluster Role Binding',
      );

      clusterRole.children.push(clusterRoleBinding);
      cluster.children.push(clusterRole);
      tree.push(cluster);
    } else if (entityType == 'ServiceAccount') {
      const cluster = getTag('kube_cluster_name', 'Cluster');
      const serviceAccount = getTag('kube_service_account', 'Service Account');

      cluster.children.push(serviceAccount);
      tree.push(cluster);
    }
  }

  return (
    <div className="service-map">
      {tree && tree.length ? (
        <Tree
          data={tree}
          nodeSize={{ x: 200, y: 100 }}
          translate={{ x: 40, y: 120 }}
          renderCustomNodeElement={(rd3tProps) => (
            <KubernetesRelatedResourcesMapNode
              {...rd3tProps}
              colorsByEntityName={colorsByEntityName}
              date={date}
            />
          )}
        />
      ) : null}
    </div>
  );
};

export default KubernetesRelatedResources;
