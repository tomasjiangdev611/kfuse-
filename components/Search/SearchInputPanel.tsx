import classnames from 'classnames';
import { useMap, useSelectedFacetValuesByNameState } from 'hooks';
import React, { useMemo, useState } from 'react';
import { traceLabelValues } from 'requests';
import { DateSelection, SpanFilter } from 'types';
import SearchInputPanelWithNormalSearched from './SearchInputPanelWithNormalSearched';

type Props = {
  close: () => void;
  date: DateSelection;
  focus: VoidFunction;
  labelNames: string[];
  search: string;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  setSearch: (search: string) => void;
  spanFilter: SpanFilter;
};

const SearchInputPanel = ({
  close,
  date,
  focus,
  labelNames,
  search,
  selectedFacetValuesByNameState,
  setSearch,
  spanFilter,
}: Props) => {
  const labelValuesByNameMap = useMap();
  const [activeIndex, setActiveIndex] = useState(0);

  const searchedLabelNames: string[] = useMemo(() => {
    const searchLowered = search.toLowerCase().trim();

    if (searchLowered) {
      return labelNames.filter(
        (labelName) => labelName.toLowerCase().indexOf(searchLowered) > -1,
      );
    }

    return labelNames;
  }, [labelNames, search]);

  const searchedLabelValues: string[] = useMemo(() => {
    const searchParts = search.split(':');
    if (searchParts.length > 1) {
      const [name, searchLabelValue] = searchParts;
      const labelValues = labelValuesByNameMap.state[name] || [];
      const searchLabelValueLowered = searchLabelValue.toLowerCase().trim();

      if (searchLabelValueLowered && labelValues.length) {
        return labelValues.filter(
          (labelValue: string) =>
            labelValue.toLowerCase().indexOf(searchLabelValueLowered) > -1,
        );
      }

      return labelValues;
    }

    return [];
  }, [search, labelValuesByNameMap.state]);

  const onClickLabelNameHandler = (labelName: string) => () => {
    setActiveIndex(0);
    setSearch(`${labelName}:`);
    traceLabelValues({ date, labelName, spanFilter }).then((result) => {
      labelValuesByNameMap.add(
        labelName,
        result.map((valueCount) => valueCount.value),
      );
    });
    focus();
  };

  const onClickLabelValueHandler = (labelValue: string) => () => {
    selectedFacetValuesByNameState.toggleFacetValue({
      isSelecting: true,
      name: search.split(':')[0],
      value: labelValue,
    });
    setSearch('');
    close();
  };

  return (
    <div className="search__input__panel">
      {search.indexOf(':') > -1 ? (
        <SearchInputPanelWithNormalSearched
          activeIndex={activeIndex}
          onClickLabelValueHandler={onClickLabelValueHandler}
          searchedLabelValues={searchedLabelValues}
          setActiveIndex={setActiveIndex}
          onClickLabelNameHandler={onClickLabelNameHandler}
        />
      ) : (
        searchedLabelNames.map((labelName, i) => (
          <div
            className={classnames({
              search__input__panel__item: true,
              'search__input__panel__item--active': i === activeIndex,
            })}
            key={labelName}
            onClick={onClickLabelNameHandler(labelName)}
            onMouseEnter={() => setActiveIndex(i)}
          >
            {labelName}
          </div>
        ))
      )}
    </div>
  );
};

export default SearchInputPanel;
