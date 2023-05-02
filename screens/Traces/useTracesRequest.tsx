import {
  useRequest,
  useSelectedFacetRangeByNameState,
  useSelectedFacetValuesByNameState,
} from 'hooks';
import { useEffect, useRef, useState } from 'react';
import { getTraces } from 'requests';
import { DateSelection, SpanFilter } from 'types';

const limit = 100;

const getTimeMs = ({ date, lastTimestamp }) => {
  const { startTimeUnix, endTimeUnix } = date;
  if (lastTimestamp) {
    const endTimeMs = Math.round(lastTimestamp / 1000000);
    const startTimeMs = endTimeMs - (endTimeUnix - startTimeUnix) * 1000000;
    return {
      startTimeMs,
      endTimeMs,
    };
  }

  return {
    endTimeMs: endTimeUnix * 1000,
    startTimeMs: startTimeUnix * 1000,
  };
};

type Args = {
  date: DateSelection;
  service: string;
  selectedFacetRangeByNameState: ReturnType<
    typeof useSelectedFacetRangeByNameState
  >;
  selectedFacetValuesByNameState: ReturnType<
    typeof useSelectedFacetValuesByNameState
  >;
  spanFilter: SpanFilter;
  traceIdSearch: string;
};

const useTracesRequest = ({
  date,
  service,
  selectedFacetRangeByNameState,
  selectedFacetValuesByNameState,
  spanFilter,
  traceIdSearch,
}: Args) => {
  const lastTimestampRef = useRef<number>(null);
  const request = useRequest(getTraces);
  const [result, setResult] = useState([]);

  const call = () => {
    const lastTimestamp = lastTimestampRef.current;
    const { endTimeMs, startTimeMs } = getTimeMs({ date, lastTimestamp });
    request
      .call({
        endTimeMs,
        startTimeMs,
        limit,
        service,
        selectedFacetRangeByName: selectedFacetRangeByNameState.state,
        selectedFacetValuesByName: selectedFacetValuesByNameState.state,
        spanFilter,
        traceIdSearch,
      })
      .then((nextResult) => {
        if (nextResult.length) {
          lastTimestampRef.current =
            nextResult[nextResult.length - 1].span.startTimeNs;
        }

        setResult((prevResult) => [...prevResult, ...nextResult]);
      });
  };

  const onScrollEnd = () => {
    call();
  };

  useEffect(() => {
    lastTimestampRef.current = null;
    setResult([]);
    call();
  }, [
    date,
    selectedFacetRangeByNameState.state,
    selectedFacetValuesByNameState.state,
    spanFilter,
    traceIdSearch,
  ]);

  return {
    call,
    isLoading: request.isLoading,
    onScrollEnd,
    result,
  };
};

export default useTracesRequest;
