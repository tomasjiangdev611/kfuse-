import { SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import buildKubeFilter from './utils/buildKubeFilter';
import { currentEntity } from './utils/kubernetesEntityQuery';

type Args = {
  selectedFacetValuesByName: SelectedFacetValuesByName;
  filterByFacets: any;
  entityType: string;
  sortBy: string;
  sortOrder: string;
  offset: number;
  pageLimit: number;
};

const kubeEntities = async ({
  entityType,
  filterByFacets,
  offset,
  pageLimit,
  selectedFacetValuesByName,
  sortBy,
  sortOrder,
}: Args): Promise<any> => {
  return queryEventService<Array<any>, 'kubeEntities'>(`
    {
        kubeEntities (
        entityType: ${entityType}
       ${
         sortOrder && sortBy
           ? 'sortOrder:' +
             sortOrder +
             ' sortBy:' +
             '{ key: "' +
             sortBy.key +
             '",type:' +
             sortBy.type +
             '}'
           : ''
       }  
        offset: ${offset}
        limit: ${pageLimit}
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

export default kubeEntities;
