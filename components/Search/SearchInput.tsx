import {
  useRequest,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import React, { MutableRefObject, useMemo, useState } from 'react';
import { DateSelection, SpanFilter } from 'types';
import SearchInputPanel from './SearchInputPanel';
import SearchInputTriggerTags from './SearchInputTriggerTags';
import { Input } from '../Input';
import { PopoverPosition, PopoverTriggerV2 } from '../PopoverTriggerV2';

type Props = {
  date: DateSelection;
  focus: VoidFunction;
  inputRef: MutableRefObject<HTMLInputElement>;
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
};

const SearchInput = ({
  date,
  focus,
  inputRef,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  setStringSearch,
  spanFilter,
  stringSearch,
  traceLabelNamesRequest,
}: Props) => {
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState('');

  const labelNames: string[] = useMemo(
    () => (traceLabelNamesRequest.result || []).sort(),
    [traceLabelNamesRequest.result],
  );

  const onClose = () => {
    setSearch('');
  };

  const onEnterHandler = (close: VoidFunction) => () => {
    if (search && search.indexOf(':') === -1) {
      setStringSearch(search);
      setSearch('');
      close();
    }
  };

  return (
    <div className="search__input">
      <div className="search__input__left">Search for</div>
      <PopoverTriggerV2
        className="search__input__right"
        onClose={onClose}
        forceOpen={Boolean(edit)}
        popover={({ close }) => (
          <SearchInputPanel
            close={close}
            date={date}
            focus={focus}
            labelNames={labelNames}
            search={search}
            selectedFacetValuesByNameState={selectedFacetValuesByNameState}
            setSearch={setSearch}
            spanFilter={spanFilter}
          />
        )}
        position={PopoverPosition.BOTTOM_LEFT}
      >
        {({ close, isOpen }) => (
          <div className="search__input__trigger" onClick={focus}>
            <div className="search__input__trigger__items">
              <SearchInputTriggerTags
                close={close}
                isOpen={isOpen}
                selectedFacetRangeByNameState={selectedFacetRangeByNameState}
                selectedFacetValuesByNameState={selectedFacetValuesByNameState}
                setEdit={setEdit}
                setStringSearch={setStringSearch}
                stringSearch={stringSearch}
              />
              {isOpen ? (
                <div className="search__input__trigger__item">
                  <div className="search__input__trigger__input">
                    <Input
                      autoFocus
                      className="search__input__trigger__input__input"
                      onChange={setSearch}
                      onEnter={onEnterHandler(close)}
                      ref={inputRef}
                      type="text"
                      value={search}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </PopoverTriggerV2>
    </div>
  );
};

export default SearchInput;
