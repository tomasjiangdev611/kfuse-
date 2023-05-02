import { useLeftSidebarState, Search } from 'components';
import {
  useRequest,
  useSearch,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import React, { useMemo } from 'react';
import { DateSelection, SpanFilter, TracesTab } from 'types';

type Props = {
  date: DateSelection;
  leftSidebarState: ReturnType<typeof useLeftSidebarState>;
  search: ReturnType<typeof useSearch>;
  selectedFacetRangeByNameState: ReturnType<
    typeof useSelectedFacetRangeByNameState
  >;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  setTraceIdSearch: (traceId: string) => void;
  spanFilter: SpanFilter;
  traceIdSearch: string;
  traceLabelNamesRequest: ReturnType<typeof useRequest>;
  tracesTab: TracesTab;
};

const getOptions = (traceLabelNamesRequest: ReturnType<typeof useRequest>) => {
  if (!traceLabelNamesRequest.result) {
    return { groupByOptions: [], measureOptions: [] };
  }

  const labelOptions = ['duration', ...(traceLabelNamesRequest.result || [])]
    .sort()
    .map((label) => ({
      label: label === 'duration' ? 'duration (ms)' : label,
      value: label,
    }));

  const groupByOptions = [{ label: 'Everything', value: '*' }, ...labelOptions];
  const measureOptions = [{ label: 'All spans', value: null }, ...labelOptions];

  return {
    groupByOptions,
    measureOptions,
  };
};

const TracesSearch = ({
  date,
  leftSidebarState,
  search,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  setTraceIdSearch,
  spanFilter,
  traceLabelNamesRequest,
  traceIdSearch,
  tracesTab,
}: Props) => {
  const { groupByOptions, measureOptions } = useMemo(
    () => getOptions(traceLabelNamesRequest),
    [traceLabelNamesRequest.result],
  );

  return (
    <Search
      date={date}
      groupByOptions={groupByOptions}
      leftSidebarState={leftSidebarState}
      measureOptions={measureOptions}
      search={search}
      selectedFacetRangeByNameState={selectedFacetRangeByNameState}
      selectedFacetValuesByNameState={selectedFacetValuesByNameState}
      setStringSearch={setTraceIdSearch}
      spanFilter={spanFilter}
      stringSearch={traceIdSearch}
      traceLabelNamesRequest={traceLabelNamesRequest}
      tracesTab={tracesTab}
    />
  );
};

export default TracesSearch;
