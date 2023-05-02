import { RightSidebar, Loader, Table } from 'components';
import classnames from 'classnames';
import { colorsByLogLevel } from 'constants';
import {
  useColorsByServiceName,
  useRequest,
  useSelectedFacetValuesByNameState,
  useToggle,
} from 'hooks';
import React, { useState, useEffect } from 'react';
import KubernatesRightSideBarDetails from './KubernetesRightSideBarDetails';
import KubernatesTags from './KubernetesTags';
import KubernetesLabels from './KubernetesLabels';
import KubernetesSideBarYaml from './KubernetesSideBarYaml';
import KubernetesRelatedResources from './KubernetesRelatedResources';
import KubernetesViewRelatedDropdown from './KubernetesViewRelatedDropdown';
import ViewRelatedTable from './ViewRelatedTable';
import { KpisByFunctionName } from 'screens/Serverless/types';
import KubernetesRulesTable from './ViewRelatedTables/KubernetesRulesTable';
import KubernetesSubjectsTable from './ViewRelatedTables/KubernetesSubjectsTable';
import { kubeViewRelatedEntities, kubeYaml } from 'requests';
import { useKubesState } from './hooks';
import { DateSelection } from 'types/DateSelection';
import { entityKeyMapping } from './utils/entityKeyMapping';

export const entityMapping: { [key: string]: string } = {
  Pod: 'pod',
  Cluster: 'cluster',
  Namespace: 'namespace',
  Node: 'node',
  Deployment: 'deployment',
  ReplicaSet: 'replicaSet',
  Job: 'job',
  CronJob: 'cronJob',
  DaemonSet: 'daemonSet',
  StatefulSet: 'statefulSet',
  Service: 'service',
  Ingress: 'ingress',
  PersistentVolumeClaim: 'persistentVolumeClaim',
  PersistentVolume: 'persistentVolume',
  Role: 'role',
  RoleBinding: 'roleBinding',
  ClusterRole: 'clusterRole',
  ClusterRoleBinding: 'clusterRoleBinding',
  ServiceAccount: 'serviceAccount',
};

type Props = {
  activeKube: any;
  entityType: string;
  close: VoidFunction;
  colorsByFunctionName: ReturnType<typeof useColorsByServiceName>;
  date: DateSelection;
  kpisByFunctionName: KpisByFunctionName;
  kubeState: ReturnType<typeof useKubesState>;
  setEntityType: React.Dispatch<React.SetStateAction<string>>;
};

const KubernetesRightSideBar = ({
  activeKube,
  entityType,
  close,
  colorsByFunctionName,
  date,
  setEntityType,
  kpisByFunctionName,
  kubeState,
}: Props) => {
  const showYamlToggle = useToggle(true);
  const showRelatedResourcesToggle = useToggle();
  const showLogsToggle = useToggle();
  const showApmToggle = useToggle();
  const showMetricesToggle = useToggle();
  const kubesState = useKubesState(entityType);
  const kubeViewRelatedEntitiesRequest = useRequest(kubeViewRelatedEntities);
  const kubeYamlRequest = useRequest(kubeYaml);
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();

  const entity = activeKube[entityMapping[entityType]];
  const name = entity
    ? entityType == 'Cluster'
      ? entity.clusterName
      : entity.metadata.name
    : '';
  const viewRelatedInitialValue = entityType === 'Pod' ? 'Cluster' : 'Pod';
  const [viewRelatedEntity, setViewRelatedEntity] = useState(
    viewRelatedInitialValue,
  );

  const entityMultipleKeyMapping: { [key: string]: any } = {
    Pod: ['kube_cluster_name'],
    Pod_Service: ['kube_cluster_name', 'kube_service', 'kube_namespace'],
    Cluster: ['kube_cluster_name'],
    Node: ['kube_cluster_name', 'kube_node'],
    Deployment: ['kube_cluster_name', 'kube_deployment', 'kube_namespace'],
    ReplicaSet: ['kube_cluster_name', 'kube_replica_set', 'kube_namespace'],
    CronJob: ['kube_cluster_name', 'kube_cron_job'],
    DaemonSet: ['kube_cluster_name', 'kube_daemon_set', 'kube_namespace'],
    StatefulSet: ['kube_cluster_name', 'kube_stateful_set', 'kube_namespace'],
    Service: ['kube_cluster_name', 'kube_service', 'kube_namespace'],
    Namespace: ['kube_cluster_name', 'kube_namespace'],
    Ingress: ['kube_cluster_name', 'kube_namespace', 'kube_service'],
    Job: ['kube_cluster_name', 'kube_job'],
    PersistentVolumeClaim: [
      'kube_cluster_name',
      'persistentvolumeclaim',
      'kube_namespace',
    ],
    PersistentVolume: [
      'kube_cluster_name',
      'kube_persistent_volume',
      'kube_namespace',
    ],
    Role: ['kube_cluster_name'],
    RoleBinding: ['kube_cluster_name'],
    ClusterRole: ['kube_cluster_name'],
    ClusterRoleBinding: ['kube_cluster_name'],
    ServiceAccount: ['kube_cluster_name'],
  };

  useEffect(() => {
    const keyData = entityKeyMapping[entityType];
    const valueData = entity.tags.find((tag) => tag.startsWith(keyData));
    const queryStr = valueData.replace(':', '=');
    if (entityType != 'Cluster') {
      kubeYamlRequest.call({
        entityType: entityType,
        filterByFacets: {
          [`${queryStr}`]: true,
        },
        selectedFacetValuesByName: selectedFacetValuesByNameState.state,
      });
    }
  }, [
    entityType,
    selectedFacetValuesByNameState.state,
    kubesState.filterByFacets,
  ]);

  useEffect(() => {
    const podNameTag = entity.tags.find((tag) =>
      tag.startsWith(entityKeyMapping[viewRelatedEntity]),
    );
    let keyData = '';
    let valueData = '';
    if (podNameTag) {
      keyData =
        entityType === 'Cluster'
          ? entityKeyMapping['Cluster']
          : entityKeyMapping[viewRelatedEntity];
      valueData = entity.tags.find((tag) => tag.startsWith(keyData));
    }

    let keyDataArray = [];
    let valueDataArray = [];

    let value = valueData ? valueData.split(':')[1] : '';

    if (entityType == 'Pod' && viewRelatedEntity == 'Service') {
      keyDataArray = entityMultipleKeyMapping['Pod_Service'];
      valueDataArray = keyDataArray.map((key) => {
        const tag = entity?.tags?.find((tag) => tag.startsWith(`${key}:`));
        return tag ? tag.split(':')[1] : undefined;
      });
      value = '';
    }

    if (keyData == '') {
      keyDataArray = entityMultipleKeyMapping[entityType];
      valueDataArray = keyDataArray.map((key) => {
        const tag = entity?.tags?.find((tag) => tag.startsWith(`${key}:`));
        return tag ? tag.split(':')[1] : undefined;
      });
    }

    kubeViewRelatedEntitiesRequest.call({
      entityType: viewRelatedEntity,
      filterByFacets: kubesState.filterByFacets,
      selectedFacetValuesByName: {
        ...{
          key: value ? keyData : keyDataArray,
          value: value ? value : valueDataArray,
        },
        ...selectedFacetValuesByNameState.state,
      },
    });
  }, [
    viewRelatedEntity,
    selectedFacetValuesByNameState.state,
    kubesState.filterByFacets,
  ]);

  const getTableBasedOnEnitityType = () => {
    switch (entityType) {
      case 'Role':
        return KubernetesRulesTable(colorsByFunctionName, entity);
      case 'RoleBinding':
        return KubernetesSubjectsTable(colorsByFunctionName, entity);
      case 'ClusterRole':
        return KubernetesRulesTable(colorsByFunctionName, entity);
      case 'ClusterRoleBinding':
        return KubernetesSubjectsTable(colorsByFunctionName, entity);
    }
  };

  let jobArray: any = [];
  if (viewRelatedEntity === 'Namespace') {
    if (entityType === 'CronJob') {
      jobArray = [activeKube.cronJob];
    } else if (entityType === 'Job') {
      jobArray = [activeKube.job];
    }
  }

  return (
    <RightSidebar
      className="kubernetes__right-sidebar"
      close={close}
      title={entityType + ' ' + name}
    >
      <div className="kubernetes__right-sidebar__time">
        <div className="kubernetes__right__time__left">
          <div className="kubernetes__right-sidebar__time__item">
            {entityType == 'Pod' ? (
              <div
                className="kubernetes__right-sidebar__message__header__status"
                style={{
                  backgroundColor:
                    colorsByLogLevel[entity.status.toLowerCase()],
                }}
              >
                {entity?.status.toUpperCase()}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="kubernetes__tags__details">
        <KubernatesRightSideBarDetails
          entity={entity}
          entityType={entityType}
          kubeState={kubeState}
          close={close}
        />
      </div>
      {entityType !== 'Cluster' ? (
        <div className="kubernetes__tags__details">
          <p className="kubernetes__tags__subheader">Tags</p>
          <KubernatesTags kubeState={kubeState} close={close} row={entity} />
        </div>
      ) : null}
      {entityType !== 'Cluster' &&
      entityType !== 'CronJob' &&
      entityType !== 'RoleBinding' ? (
        <div className="kubernetes__tags__details">
          <p className="kubernetes__tags__subheader">Kubernetes Labels</p>
          <KubernetesLabels kubeState={kubeState} close={close} row={entity} />
        </div>
      ) : null}
      {entityType !== 'Ingress' &&
      entityType !== 'Role' &&
      entityType !== 'RoleBinding' &&
      entityType !== 'ClusterRole' &&
      entityType !== 'ClusterRoleBinding' &&
      entityType !== 'ServiceAccount' ? (
        <div className="kubernetes__tags__details">
          <div className="kubernetes__viewRelated__header">
            <p className="kubernetes__tags__subheader">View Related</p>
            <KubernetesViewRelatedDropdown
              entityType={entityType}
              setViewRelatedEntity={setViewRelatedEntity}
              activeKube={activeKube}
            />
          </div>
        </div>
      ) : null}
      {entityType === 'Role' || entityType === 'ClusterRole' ? (
        <div className="kubernetes__tags__details">
          <div className="kubernetes__viewRelated__header">
            <p className="kubernetes__tags__subheader">Rules</p>
          </div>
        </div>
      ) : null}
      {entityType === 'RoleBinding' || entityType === 'ClusterRoleBinding' ? (
        <div className="kubernetes__tags__details">
          <div className="kubernetes__viewRelated__header">
            <p className="kubernetes__tags__subheader">Subjects</p>
          </div>
        </div>
      ) : null}
      {entityType !== 'Ingress' &&
      entityType !== 'Role' &&
      entityType !== 'RoleBinding' &&
      entityType !== 'ClusterRole' &&
      entityType !== 'ClusterRoleBinding' &&
      entityType !== 'ServiceAccount' ? (
        <div className="services__body">
          <Loader
            className="services__table"
            isLoading={kubeViewRelatedEntitiesRequest.isLoading}
          >
            <ViewRelatedTable
              colorsByFunctionName={colorsByFunctionName}
              viewRelatedEntity={viewRelatedEntity}
              kpisByFunctionName={
                jobArray.length > 0
                  ? jobArray
                  : kubeViewRelatedEntitiesRequest.result || {}
              }
              kubesState={kubesState}
            />
          </Loader>
        </div>
      ) : null}
      {entityType === 'Role' || entityType === 'ClusterRole' ? (
        <div className="services__body">
          <Loader className="services__table" isLoading={false}>
            <Table
              className="table--bordered table--padded"
              columns={getTableBasedOnEnitityType()}
              isSortingEnabled
              rows={entity.rules ? entity.rules : []}
            />
          </Loader>
        </div>
      ) : null}
      {entityType === 'RoleBinding' || entityType === 'ClusterRoleBinding' ? (
        <div className="services__body">
          <Loader className="services__table" isLoading={false}>
            <Table
              className="table--bordered table--padded"
              columns={getTableBasedOnEnitityType()}
              isSortingEnabled
              rows={entity.subjects ? entity.subjects : []}
            />
          </Loader>
        </div>
      ) : null}
      <div className="kubernetes__tabs kubernetes__buttons tabs__buttons--underline">
        {entityType !== 'Cluster' ? (
          <button
            className={classnames({
              tabs__buttons__item: true,
              'tabs__buttons__item--active': showYamlToggle.value,
            })}
            onClick={() => {
              showRelatedResourcesToggle.off();
              showLogsToggle.off();
              showApmToggle.off();
              showMetricesToggle.off();
              showYamlToggle.on();
            }}
          >
            YAML
          </button>
        ) : null}
        {entityType !== 'Cluster' && entityType !== 'Node' ? (
          <button
            className={classnames({
              tabs__buttons__item: true,
              'tabs__buttons__item--active': showRelatedResourcesToggle.value,
            })}
            onClick={() => {
              showYamlToggle.off();
              showLogsToggle.off();
              showApmToggle.off();
              showMetricesToggle.off();
              showRelatedResourcesToggle.on();
            }}
          >
            Related Resources
          </button>
        ) : null}
        <button
          className={classnames({
            tabs__buttons__item: true,
            'tabs__buttons__item--active': showLogsToggle.value,
          })}
          onClick={() => {
            showYamlToggle.off();
            showRelatedResourcesToggle.off();
            showApmToggle.off();
            showMetricesToggle.off();
            showLogsToggle.on();
          }}
        >
          Logs
        </button>
        <button
          className={classnames({
            tabs__buttons__item: true,
            'tabs__buttons__item--active': showApmToggle.value,
          })}
          onClick={() => {
            showYamlToggle.off();
            showRelatedResourcesToggle.off();
            showLogsToggle.off();
            showMetricesToggle.off();
            showApmToggle.on();
          }}
        >
          APM
        </button>
        <button
          className={classnames({
            tabs__buttons__item: true,
            'tabs__buttons__item--active': showMetricesToggle.value,
          })}
          onClick={() => {
            showYamlToggle.off();
            showRelatedResourcesToggle.off();
            showLogsToggle.off();
            showApmToggle.off();
            showMetricesToggle.on();
          }}
        >
          Metrics
        </button>
      </div>
      {showYamlToggle.value &&
      entityType != 'Cluster' &&
      entityType != 'ReplicaSet' ? (
        <div className="kubernetes__table__details__tags">
          <Loader isLoading={kubeYamlRequest.isLoading}>
            <KubernetesSideBarYaml
              entityType={entityType}
              kpisByFunctionName={kubeYamlRequest.result}
            />
          </Loader>
        </div>
      ) : null}
      {showRelatedResourcesToggle.value ? (
        <div className="kubernetes__table__details__tags">
          <KubernetesRelatedResources
            colorsByEntityName={colorsByFunctionName}
            date={date}
            entityType={entityType}
            row={activeKube}
            entity={entity}
          />
        </div>
      ) : null}
    </RightSidebar>
  );
};

export default KubernetesRightSideBar;
