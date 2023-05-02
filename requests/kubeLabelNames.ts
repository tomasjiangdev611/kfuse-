import queryEventService from 'requests/queryEventService';
import { FilterProps } from 'types';
import { onPromiseError } from 'utils';

type Args = FilterProps & {
  entityType: string;
};

const kubeLabelNames = async ({ entityType }: Args): Promise<any> => {
  return queryEventService<Array<any>, 'kubeFacetCounts'>(`
    {
      kubeFacetCounts(
        entityType: ${entityType},
        filter: {},
        selector:{tags:{}}
        ) {
          tags{facetKey,facetValue,count},
        }
    }
  `).then((data) => data?.kubeFacetCounts?.tags, onPromiseError);
};

export default kubeLabelNames;
