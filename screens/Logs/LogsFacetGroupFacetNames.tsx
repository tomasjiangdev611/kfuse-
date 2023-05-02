import { delimiter } from 'constants';
import { Input, Loader } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { FacetValue } from 'types';
import { useLogsState, useQueryScheduler } from './hooks';
import LogsFacetGroupFacetValue from './LogsFacetGroupFacetValue';
import { FacetBase } from './types';

const searchFacetValues = (
  facetValues: FacetValue[],
  facetValueSearch: string,
) => {
  const searchLowered = facetValueSearch.trim().toLowerCase();
  if (!searchLowered) {
    return facetValues.sort((a, b) => a.facetValue.localeCompare(b.facetValue));
  }

  return facetValues
    .filter((facetValue) => facetValue.facetValue.indexOf(searchLowered) > -1)
    .sort((a, b) => a.facetValue.localeCompare(b.facetValue));
};

const LogsFacetGroupFacetNames = ({
  disableSearch,
  facet,
  getLogFacetValuesCountsRequest,
  logsState,
  queryScheduler,
  renderValue,
}: {
  disableSearch?: boolean;
  facet: FacetBase;
  getLogFacetValuesCountsRequest: ReturnType<typeof useRequest>;
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
  renderValue?: (label: string) => ReactNode;
}): ReactElement => {
  const [initialFacetValues, setInitialFacetValues] = useState<FacetValue[]>(
    [],
  );
  const [countsByFacetValue, setCountsByFacetValue] = useState({});
  const [facetValueSearch, setFacetValueSearch] = useState<string>('');

  const { component, name } = facet;
  const facetKey = `${component}${delimiter}${name}`;
  const isLoading = getLogFacetValuesCountsRequest.isLoading;
  const facetValues = getLogFacetValuesCountsRequest.result || [];

  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
    selectedFacetValues,
  } = logsState;

  const selectionByFacetKey = initialFacetValues.reduce(
    (obj, facetValue: FacetValue) => {
      const compositeKey = `${facetKey}${delimiter}${facetValue.facetValue}`;
      const nextObj = { ...obj };
      if (compositeKey in selectedFacetValues) {
        nextObj[compositeKey] = selectedFacetValues[compositeKey];
      }

      return nextObj;
    },
    {},
  );

  const searchedFacetValues = searchFacetValues(
    initialFacetValues,
    facetValueSearch,
  );

  const fetchLogFacetValuesCounts = () =>
    getLogFacetValuesCountsRequest
      .call({
        date,
        facetName: name,
        facetSource: component,
        filterByFacets,
        filterOrExcludeByFingerprint,
        keyExists,
        selectedFacetValues,
        searchTerms,
      })
      .then((facetValues) => {
        if (initialFacetValues.length < facetValues.length) {
          setInitialFacetValues(facetValues);
        }

        const nextCountsByFacetValue = facetValues.reduce(
          (obj, facetValue) => ({
            ...obj,
            [facetValue.facetValue]: facetValue.count,
          }),
          {},
        );

        setCountsByFacetValue(nextCountsByFacetValue);
      });

  const isLogLevelFacet = component === 'Core' && name === 'level';

  useEffect(() => {
    if (isLogLevelFacet && queryScheduler.firstQueryCompletedAt) {
      fetchLogFacetValuesCounts().finally(
        queryScheduler.setSecondQueryCompletedAt,
      );
    }
  }, [queryScheduler.firstQueryCompletedAt]);

  useEffect(() => {
    if (queryScheduler.secondQueryCompletedAt && !isLogLevelFacet) {
      fetchLogFacetValuesCounts();
    }
  }, [queryScheduler.secondQueryCompletedAt]);

  return (
    <div>
      {!disableSearch && facetValues.length > 6 ? (
        <div className="logs__facet-group__facet__toolbar">
          <Input
            className="logs__facet-group__facet__toolbar__input"
            onChange={setFacetValueSearch}
            placeholder={`Filter ${name}`}
            type="text"
            value={facetValueSearch}
          />
        </div>
      ) : null}
      <Loader
        className="logs__facet-group__facet__facet-values"
        isLoading={isLoading}
      >
        {!isLoading && searchedFacetValues.length === 0 ? (
          <div className="logs__facet-group__facet__facet-values__placeholder">{`No facet values for ${name}`}</div>
        ) : (
          searchedFacetValues.map((facetValue) => {
            const facetValueCompositeKey = `${component}${delimiter}${name}${delimiter}${facetValue.facetValue}`;
            return (
              <LogsFacetGroupFacetValue
                count={countsByFacetValue[facetValue.facetValue]}
                enabled={!selectedFacetValues[facetValueCompositeKey]}
                facetKey={facetKey}
                facetValue={facetValue}
                facetValues={facetValues}
                facetValueCompositeKey={facetValueCompositeKey}
                key={facetValueCompositeKey}
                logsState={logsState}
                name={name}
                selectionByFacetKey={selectionByFacetKey}
                source={component}
                renderValue={renderValue}
              />
            );
          })
        )}
      </Loader>
    </div>
  );
};

export default LogsFacetGroupFacetNames;
