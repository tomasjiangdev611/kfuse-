import { SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import buildKubeFilter from './utils/buildKubeFilter';

type Args = {
  selectedFacetValuesByName: SelectedFacetValuesByName;
  filterByFacets: any;
  entityType: string;
  tags: string;
  groupKey?: string;
};

const kubeNamespaceCount = async ({
  entityType,
  groupKey,
  filterByFacets,
  selectedFacetValuesByName,
}: Args): Promise<any> => {
  return queryEventService<Array<any>, 'kubeEntityGroups'>(`
    {
      kubeEntityGroups(entityType: ${entityType}, 
        filter: ${buildKubeFilter(
          filterByFacets,
          [],
          selectedFacetValuesByName,
        )} 
        ${groupKey ? 'groupBys: [{type: TAG, key: "kube_namespace"}]' : ''}
        ) {
        count
        groupBys {
          type
          key
          value
        }
      }
    }
  `).then((data) => data.kubeEntityGroups || [], onPromiseError);
};

export default kubeNamespaceCount;
