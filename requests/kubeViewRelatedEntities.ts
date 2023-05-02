import { SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import buildKubeFilter from './utils/buildKubeFilter';
import { currentEntity } from './utils/kubernetesEntityQuery';

type Args = {
  selectedFacetValuesByName: SelectedFacetValuesByName;
  filterByFacets: any;
  entityType: string;
};

const kubeViewRelatedEntities = async ({
  entityType,
  filterByFacets,
  selectedFacetValuesByName,
}: Args): Promise<any> => {
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
        ${currentEntity(entityType)}
        }
    }
  `).then((data) => data.kubeEntities || [], onPromiseError);
};

export default kubeViewRelatedEntities;
