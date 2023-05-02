import { useSelectedFacetValuesByNameState } from 'hooks';
import { useState } from 'react';
import { SpanFilter } from 'types';

const getIsErrorOnlyChecked = (
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >,
): boolean =>
  selectedFacetValuesByNameState.state.error &&
  Object.keys(selectedFacetValuesByNameState.state.error).length === 1 &&
  selectedFacetValuesByNameState.state.error.true;

const useSpanFilters = (
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >,
) => {
  const [spanFilter, setSpanFilter] = useState<SpanFilter>(SpanFilter.allSpans);

  const onChangeError = (checked: boolean) => {
    if (checked) {
      selectedFacetValuesByNameState.selectOnlyFacetValue({
        name: 'error',
        value: 'true',
      });
    } else {
      selectedFacetValuesByNameState.clearFacet('error');
    }
  };

  return {
    isErrorOnlyChecked: getIsErrorOnlyChecked(selectedFacetValuesByNameState),
    onChangeError,
    spanFilter,
    setSpanFilter,
  };
};

export default useSpanFilters;
