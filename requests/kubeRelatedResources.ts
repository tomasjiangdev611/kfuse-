import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';

type Args = {
  entityType: string;
};

const kubeRelatedResources = async ({
  entityType,
}: Args): Promise<KubeFacetCounts[]> => {
  return queryEventService<KubeFacetCounts[], 'kubes'>(`
{
    kubeEntities(entityType: ${entityType}, filter: {eq: {
      facet: { type: TAG, key: "kube_node", value: "gke-demo-2-target-pool-1-20ce67e4-f72k" }
    }}) {
      pod {
        metadata {
          name
        }
        tags
      }
    }
  }
  `).then((data) => data || [], onPromiseError);
};

export default kubeRelatedResources;
