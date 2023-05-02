import { SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import buildKubeFilter from './utils/buildKubeFilter';

type Args = {
  selectedFacetValuesByName: SelectedFacetValuesByName;
  filterByFacets: any;
  entityType: string;
};

const kubeYaml = async ({
  entityType,
  filterByFacets,
  selectedFacetValuesByName,
}: Args): Promise<any> => {
  let yamlEntity: string;
  if (entityType === 'ReplicaSet') {
    yamlEntity = 'replicaSet';
  } else if (entityType === 'CronJob') {
    yamlEntity = 'cronJob';
  } else if (entityType === 'DaemonSet') {
    yamlEntity = 'daemonSet';
  } else if (entityType === 'StatefulSet') {
    yamlEntity = 'statefulSet';
  } else if (entityType === 'PersistentVolumeClaim') {
    yamlEntity = 'persistentVolumeClaim';
  } else if (entityType === 'PersistentVolume') {
    yamlEntity = 'persistentVolume';
  } else if (entityType === 'RoleBinding') {
    yamlEntity = 'roleBinding';
  } else if (entityType === 'ClusterRoleBinding') {
    yamlEntity = 'clusterRoleBinding';
  } else if (entityType === 'ServiceAccount') {
    yamlEntity = 'serviceAccount';
  } else {
    yamlEntity = entityType.toLowerCase();
  }
  return queryEventService<Array<any>, 'kubeEntities'>(`
    {
        kubeEntities (
        entityType: ${entityType}
        filter: ${buildKubeFilter(
          filterByFacets,
          [],
          selectedFacetValuesByName,
        )}
      ) {
        ${yamlEntity}{yaml}
      }
    }
  `).then((data) => data.kubeEntities || [], onPromiseError);
};

export default kubeYaml;
