import classnames from 'classnames';
import { Input } from 'components';
import { CoreLabels } from 'constants/labels';
import React, { ReactElement, useEffect } from 'react';
import { X } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { checkSourceExist, checkFingerPrintExists, groupLabels } from 'utils';
import { RequestResult } from 'types';

import { useLogsState } from '../hooks';
import LogsSearchBarAutocomplete from './LogsSearchBarAutocomplete';
import LogsSearchBarEditFacetValue from './LogsSearchBarEditFacetValue';
import useLogsSearchBar from './useLogsSearchBar';

const LogsSearchBar = ({
  getFacetNamesRequest,
  logsState,
}: {
  getFacetNamesRequest: RequestResult;
  logsState: ReturnType<typeof useLogsState>;
}): ReactElement => {
  const {
    activePanel,
    focusToggle,
    editFacet,
    getLabelNamesRequest,
    inputRef,
    markForDeletionToggle,
    onAutocompleteOptionClick,
    onBackspace,
    onChange,
    onClick,
    onEnter,
    onFoucs,
    openDefinedFacetPanel,
    search,
    setActivePanel,
    setEditFacet,
    setSearch,
    setSearchItems,
    tags,
  } = useLogsSearchBar(getFacetNamesRequest, logsState);

  const [params] = useSearchParams();
  const searchParam = params.get('search');
  const {
    clear,
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    labels,
    selectedFacetValues,
    searchTerms,
    setLabels,
  } = logsState;

  const clearHandler = (e) => {
    e.stopPropagation();
    clear();
  };

  useEffect(() => {
    if (searchParam && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchParam]);

  useEffect(() => {
    const cleanup = () => {
      inputRef.current.removeEventListener('mouseenter', callFacetNameRequest);
    };

    const callFacetNameRequest = () => {
      if (!labels) {
        getLabelNamesRequest
          .call({ date, filterOrExcludeByFingerprint })
          .then((response: any) => {
            const { additionalLabels, cloudLabels, kubernetesLabels } =
              groupLabels(response || []);
            setLabels({
              additional: additionalLabels,
              cloud: cloudLabels,
              core: CoreLabels,
              kubernetes: kubernetesLabels,
            });
          });
      }

      if (!getFacetNamesRequest.result) {
        getFacetNamesRequest.call({ date, filterOrExcludeByFingerprint });
      }
      cleanup();
    };

    inputRef.current.addEventListener('mouseenter', callFacetNameRequest);
    return () => cleanup();
  }, [date, getFacetNamesRequest.result, labels]);

  const renderAutocomplete = () => {
    const {
      operatorSign,
      options,
      optionType,
      panelWidth,
      searchOption,
      typed,
      value,
    } = activePanel;

    return (
      <div tabIndex={1} className="logs__search__input__autocomplete-panel">
        <div
          className="logs__search__input__autocomplete-panel__container"
          style={{ width: panelWidth, maxHeight: 500 }}
        >
          <LogsSearchBarAutocomplete
            close={() => setActivePanel(null)}
            onClickHandler={onAutocompleteOptionClick}
            operatorSign={operatorSign}
            options={options}
            optionType={optionType}
            searchOption={searchOption}
            setSearchItems={setSearchItems}
            setSearch={setSearch}
            typed={typed}
            value={value}
          />
        </div>
      </div>
    );
  };

  const isSourceExist =
    checkSourceExist(selectedFacetValues, filterByFacets) ||
    checkFingerPrintExists(filterOrExcludeByFingerprint);

  return (
    <div className="field-group logs__search__input">
      <div
        className="field-group__item field-group__item--flex"
        onBlur={(e) => {
          if (
            !e.relatedTarget ||
            !e.relatedTarget.classList.contains(
              'logs__search__input__autocomplete-panel',
            )
          ) {
            setActivePanel(null);
          }
        }}
      >
        <div className="logs__search-bar" onClick={onClick}>
          {tags.map((tag, i) => {
            const onRemove = (e) => {
              e.stopPropagation();
              tag.onClick();
            };

            const onEdit = (e) => {
              e.stopPropagation();
              tag.onEdit();
            };
            return (
              <div
                key={i}
                className={classnames({
                  chip: true,
                  'chip--marked-for-deletion':
                    markForDeletionToggle.value && i === tags.length - 1,
                  'chip--disabled-red':
                    !isSourceExist && tag.label.startsWith('search:'),
                })}
                title={tag.label}
              >
                {tag.onEdit ? (
                  <button
                    className="chip__label chip__label--clickable"
                    onClick={onEdit}
                  >
                    {tag.label}
                  </button>
                ) : (
                  <span className="chip__label">{tag.label}</span>
                )}
                <button
                  className="chip__button"
                  onClick={onRemove}
                  type="button"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
          {editFacet ? (
            <LogsSearchBarEditFacetValue
              {...editFacet}
              logsState={logsState}
              setEditFacet={setEditFacet}
            />
          ) : (
            <Input
              className="logs__search-bar__input"
              onBackspace={onBackspace}
              onBlur={focusToggle.off}
              onChange={onChange}
              onEnter={onEnter}
              onFocus={onFoucs}
              ref={inputRef}
              placeholder="Search Logs"
              type="text"
              value={search}
            />
          )}
          {tags.length ? (
            <button
              className="logs__search-bar__input__clear"
              type="button"
              onClick={clearHandler}
            >
              <X color="#da545b" size={16} />
            </button>
          ) : null}
        </div>
        {activePanel && renderAutocomplete()}
        {!isSourceExist && searchTerms.length > 0 ? (
          <div className="text--yellow logs__search-bar--error-text">
            Please select a source to search, adding source will speed up your
            search. <a onClick={openDefinedFacetPanel}>Get source list</a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LogsSearchBar;
