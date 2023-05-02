import dayjs from 'dayjs';
import {
  useDateState,
  useRequest,
  useSelectedFacetValuesByNameState,
  useUrlState,
} from 'hooks';
import { useEffect, useMemo } from 'react';
import { eventFacetValues, eventLabelNames, eventLabelValues } from 'requests';
import { convertTimeStringToUnix, groupLabels } from 'utils';

const getLast12HoursDate = () => {
  const endTimeUnix = dayjs().unix();
  const startTimeUnix = dayjs().subtract(12, 'hour').unix();

  return {
    startLabel: 'now-12h',
    endLabel: 'now',
    endTimeUnix,
    startTimeUnix,
  };
};

const useEventsState = () => {
  const getLabelNamesRequest = useRequest(eventLabelNames);
  const selectedFacetValuesByNameState = useSelectedFacetValuesByNameState();
  const [searchTerms, setSearchTerms] = useUrlState('searchTerms', []);
  const [filterByFacets, setFilterByFacets] = useUrlState('filterByFacets', {});

  const [date, setDate] = useDateState(getLast12HoursDate());

  const refreshDate = (): void => {
    if (date.startLabel && date.endLabel) {
      const endTimeUnix = convertTimeStringToUnix(date.endLabel);
      const startTimeUnix = convertTimeStringToUnix(date.startLabel);
      if (endTimeUnix && startTimeUnix) {
        setDate({ ...date, endTimeUnix, startTimeUnix });
      }
    } else {
      setDate({ ...date, endTimeUnix: dayjs().unix() });
    }
  };

  const requestByLabelName = (labelName: string) => () =>
    eventLabelValues({
      date,
      labelName,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
    });
  const requestByFacetName = (facetName: string) => () =>
    eventFacetValues({
      date,
      facetName,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
    });

  useEffect(() => {
    getLabelNamesRequest.call({
      date,
      selectedFacetValuesByName: selectedFacetValuesByNameState.state,
    });
  }, [date, selectedFacetValuesByNameState.state]);

  const { additionalLabels, cloudLabels, kubernetesLabels } = useMemo(
    () => groupLabels(getLabelNamesRequest.result || []),
    [getLabelNamesRequest.result],
  );

  const newCloudLabels = useMemo(
    () => [
      ...cloudLabels,
      { component: 'Cloud', name: 'kube_cluster_name', type: 'string' },
    ],
    [cloudLabels],
  );

  const removeSearchTermByIndex = (index: number) => {
    setSearchTerms((prev: string[]) => {
      const newSearchTerms = [...prev];
      newSearchTerms.splice(index, 1);
      return newSearchTerms;
    });
  };

  return {
    additionalLabels,
    cloudLabels: newCloudLabels,
    date,
    filterByFacets,
    kubernetesLabels,
    refreshDate,
    removeSearchTermByIndex,
    requestByFacetName,
    requestByLabelName,
    searchTerms,
    setDate,
    setFilterByFacets,
    selectedFacetValuesByNameState,
    setSearchTerms,
  };
};

export default useEventsState;
