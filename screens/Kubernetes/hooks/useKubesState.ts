import {
  useRequest,
  useSelectedFacetValuesByNameState,
  useUrlState,
} from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { kubeFacetCount, kubeLabelNames } from 'requests';
import { groupLabels } from '../utils/selectorsfunction';

const useKubesState = (entityType) => {
  const getLabelNamesRequest = useRequest(kubeLabelNames);
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const [searchTerms, setSearchTerms] = useUrlState('searchTerms', []);
  const [filterByFacets, setFilterByFacets] = useUrlState('filterByFacets', {});
  const [facetData, setFacetLabels] = useState([]);

  const requestByLabelName = (labelName: string) => () =>
    [
      ...new Set(
        kubeFacetCount({
          entityType: entityType,
          tags: labelName.key,
          filterByFacets: kubesState.filterByFacets,
          selectedFacetValuesByName: {
            ...selectedFacetValuesByNameState.state,
          },
        }).kubeFacetCounts.tags.map((item) => item.facetKey),
      ),
    ];

  useEffect(() => {
    getLabelNamesRequest.call({
      entityType,
    });
  }, [entityType]);

  const { additionalLabels } = useMemo(
    () =>
      groupLabels(
        [
          ...new Set(getLabelNamesRequest.result?.map((item) => item.facetKey)),
        ] || [],
      ),
    [getLabelNamesRequest.result],
  );

  const additionalValues = useMemo(() => {
    return getLabelNamesRequest.result || [];
  }, [getLabelNamesRequest.result]);

  const removeSearchTermByIndex = (index: number) => {
    setSearchTerms((prev: string[]) => {
      const newSearchTerms = [...prev];
      newSearchTerms.splice(index, 1);
      return newSearchTerms;
    });
  };

  return {
    additionalLabels,
    additionalValues,
    filterByFacets,
    removeSearchTermByIndex,
    requestByLabelName,
    searchTerms,
    setFilterByFacets,
    selectedFacetValuesByNameState,
    setSearchTerms,
  };
};

export default useKubesState;
