import { SelectedFacetValuesByName } from 'types';
import { onPromiseError } from 'utils';
import queryEventService from './queryEventService';
import buildKubeFilter from './utils/buildKubeFilter';

type Args = {
  selectedFacetValuesByName: SelectedFacetValuesByName;
  filterByFacets: any;
  entityType: string;
  tags: string;
};

const kubeFacetCount = async ({
  entityType,
  tags,
  selectedFacetValuesByName,
  filterByFacets,
}: Args): Promise<any> => {
  return queryEventService<Array<any>, 'kubeFacetCounts'>(`
  {
    kubeFacetCounts(entityType: 
        ${entityType}, 
        filter: ${buildKubeFilter(
          filterByFacets,
          [],
          selectedFacetValuesByName,
        )} 
      selector: {tags: {keys:"${tags}"}}) {
      labels {
        facetKey
        facetValue
        count
      }
      tags {
        facetKey
        facetValue
        count
      }
      annotations {
        facetKey
        facetValue
        count
      }
    }
  }
  `).then(
    (data) =>
      data.kubeFacetCounts.tags.map(({ facetValue: value, ...rest }) => ({
        value,
        ...rest,
      })) || [],
    onPromiseError,
  );
};

export default kubeFacetCount;
