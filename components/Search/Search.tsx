import {
  TooltipPosition,
  TooltipTrigger,
  useLeftSidebarState,
} from 'components';
import {
  useRequest,
  useSearch,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import React, { useRef } from 'react';
import { Maximize2 } from 'react-feather';
import { DateSelection, SpanFilter, TracesTab } from 'types';
import SearchGrouper from './SearchGrouper';
import SearchInput from './SearchInput';
import SearchVisualize from './SearchVisualize';
import { SelectOption } from '../Select';

type Props = {
  date: DateSelection;
  groupByOptions: SelectOption[];
  leftSidebarState: ReturnType<typeof useLeftSidebarState>;
  measureOptions: SelectOption[];
  search: ReturnType<typeof useSearch>;
  selectedFacetRangeByNameState: ReturnType<
    typeof useSelectedFacetRangeByNameState
  >;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  setStringSearch: (s: string) => void;
  spanFilter: SpanFilter;
  stringSearch: string;
  traceLabelNamesRequest: ReturnType<typeof useRequest>;
  tracesTab: TracesTab;
};

const Search = ({
  date,
  groupByOptions,
  leftSidebarState,
  measureOptions,
  search,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  setStringSearch,
  spanFilter,
  stringSearch,
  traceLabelNamesRequest,
  tracesTab,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = () => {
    const input = inputRef.current;
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="search">
      <div className="search__top">
        {leftSidebarState.width === 0 ? (
          <TooltipTrigger
            className="logs__search__show-filters-button"
            position={TooltipPosition.TOP_LEFT}
            tooltip="Show Filters"
          >
            <button
              className="button button--icon"
              onClick={leftSidebarState.show}
            >
              <Maximize2 size={12} />
            </button>
          </TooltipTrigger>
        ) : null}
        <SearchInput
          date={date}
          focus={focus}
          inputRef={inputRef}
          selectedFacetRangeByNameState={selectedFacetRangeByNameState}
          selectedFacetValuesByNameState={selectedFacetValuesByNameState}
          setStringSearch={setStringSearch}
          spanFilter={spanFilter}
          stringSearch={stringSearch}
          traceLabelNamesRequest={traceLabelNamesRequest}
        />
      </div>
      <SearchGrouper
        date={date}
        groupByOptions={groupByOptions}
        measureOptions={measureOptions}
        search={search}
        tracesTab={tracesTab}
      />
      <SearchVisualize />
    </div>
  );
};

export default Search;
