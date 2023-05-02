import {
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import React from 'react';
import { X } from 'react-feather';
import { formatDurationNs, getIsDeselecting } from 'utils';
import { EditMode, EditState } from './types';

type Props = {
  close: () => void;
  isOpen: boolean;
  selectedFacetRangeByNameState: ReturnType<
    typeof useSelectedFacetRangeByNameState
  >;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  setEdit: (edit: EditState) => void;
  setStringSearch: (s: string) => void;
  stringSearch: string;
};

const SearchInputTriggerTags = ({
  close,
  isOpen,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  setEdit,
  setStringSearch,
  stringSearch,
}: Props) => {
  const { state } = selectedFacetValuesByNameState;
  const clearFacetByRange = (name: string) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectedFacetRangeByNameState.clearFacet(name);
    close();
  };

  const clearFacetByValue = (name: string) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectedFacetValuesByNameState.clearFacet(name);
    close();
  };

  const rangeKeys = Object.keys(selectedFacetRangeByNameState.state);
  const valueKeys = Object.keys(state);

  const keys = [...rangeKeys, ...valueKeys];

  if (!isOpen && !keys.length && !stringSearch) {
    return (
      <div className="search__input__trigger__item">
        <div className="search__input__trigger__placeholder">
          Search for any tag on ingested spans
        </div>
      </div>
    );
  }

  return (
    <>
      {valueKeys.map((name) => {
        const facetValuesBitmap = state[name];
        const facetValues = Object.keys(facetValuesBitmap);

        return (
          <div className="search__input__trigger__item" key={name}>
            <div className="search__input__trigger__tag">
              {getIsDeselecting(facetValuesBitmap) ? '-' : ''}
              <span className="search__input__trigger__tag__name">{name}</span>
              <span>:</span>
              <span className="search__input__trigger__tag__value">
                {facetValues.length === 1 ? facetValues[0] : facetValues.length}
              </span>
              <X
                className="search__input__trigger__tag__close"
                onClick={clearFacetByValue(name)}
                size={15}
              />
            </div>
          </div>
        );
      })}
      {rangeKeys.map((name) => {
        const range = selectedFacetRangeByNameState.state[name];
        const { lower, upper } = range;

        const onClick = () => {
          setEdit({
            mode: EditMode.range,
            name,
            range,
          });
        };

        return (
          <div
            className="search__input__trigger__item"
            key={name}
            onClick={onClick}
          >
            <div className="search__input__trigger__tag">
              <span className="search__input__trigger__tag__name">{`${
                lower ? `${formatDurationNs(lower * 1000000)}< ` : ''
              }${name} <${formatDurationNs(upper * 1000000)}`}</span>
              <X
                className="search__input__trigger__tag__close"
                onClick={clearFacetByRange(name)}
                size={15}
              />
            </div>
          </div>
        );
      })}
      {stringSearch ? (
        <div className="search__input__trigger__item">
          <div className="search__input__trigger__tag">
            <span className="search__input__trigger__tag__name">traceId</span>
            <span>:</span>
            <span>{stringSearch}</span>
            <X
              className="search__input__trigger__tag__close"
              onClick={() => {
                setStringSearch('');
              }}
              size={15}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SearchInputTriggerTags;
