import { Loader, Multiselect } from 'components';
import delimiter from 'constants/delimiter';
import { useRequest } from 'hooks';
import React, { useEffect, ReactElement, useState } from 'react';
import { getLabelValues, getLogFacetValuesCounts } from 'requests';
import { isSourceLabel } from 'utils';

import { useLogsState } from '../hooks';

const LogsSearchBarEditFacetValue = ({
  component,
  facetName,
  facetValuesBitMap,
  logsState,
  setEditFacet,
}: {
  component: string;
  facetName: string;
  facetValuesBitMap: { [key: string]: number };
  logsState: ReturnType<typeof useLogsState>;
  setEditFacet: (value: any) => void;
}): ReactElement => {
  const getLogFacetValuesCountsRequest = useRequest(getLogFacetValuesCounts);
  const getLogLabelValuesRequest = useRequest(getLabelValues);
  const [value, setValue] = useState(Object.keys(facetValuesBitMap));
  const { applyDeselectedFacetValues } = logsState;
  const isDeselected = Object.values(facetValuesBitMap)[0] === 0;

  const apply = () => {
    const facetValuesToSelect = value.reduce(
      (obj, facetValue) => ({
        ...obj,
        [`${component}${delimiter}${facetName}${delimiter}${facetValue}`]:
          isDeselected ? 0 : 1,
      }),
      {},
    );

    applyDeselectedFacetValues({ component, facetName, facetValuesToSelect });
    setEditFacet(null);
  };

  const cancel = () => {
    setEditFacet(null);
  };

  const {
    date,
    filterByFacets,
    filterOrExcludeByFingerprint,
    keyExists,
    onlyFilteredFacetValueByFacetKey,
    searchTerms,
  } = logsState;

  useEffect(() => {
    const payload = {
      date,
      facetName,
      facetSource: component,
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      onlyFilteredFacetValueByFacetKey,
      searchTerms,
      selectedFacetValues: {},
    };

    if (isSourceLabel(component)) {
      getLogLabelValuesRequest.call(payload);
    } else {
      getLogFacetValuesCountsRequest.call(payload);
    }
    setValue(Object.keys(facetValuesBitMap));
  }, [facetName]);

  return (
    <Loader
      className="logs__search-bar__edit__facet-value"
      isLoading={
        getLogLabelValuesRequest.isLoading ||
        getLogFacetValuesCountsRequest.isLoading
      }
    >
      <div>
        <b>{facetName}</b>
        {` to ${isDeselected ? 'exclude' : 'include'}`}
      </div>
      <div className="logs__search-bar__edit__facet-value__box">
        <div>
          <Multiselect
            options={(isSourceLabel(component)
              ? getLogLabelValuesRequest.result || []
              : getLogFacetValuesCountsRequest.result || []
            )
              .sort()
              .map((item: { count: number; facetValue: string }) => ({
                label: item.facetValue,
                value: item.facetValue,
              }))}
            onChange={setValue}
            value={value}
          />
        </div>
        <div className="logs__search-bar__edit__facet-value__buttons">
          <button
            className="button logs__search-bar__edit__facet-value__buttons__button"
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            className="button button--blue logs__search-bar__edit__facet-value__buttons__button"
            onClick={apply}
          >
            Apply
          </button>
        </div>
      </div>
    </Loader>
  );
};

export default LogsSearchBarEditFacetValue;
