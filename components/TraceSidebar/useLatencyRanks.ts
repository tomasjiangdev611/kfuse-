import { useState } from 'react';
import { getLatencyRank } from 'requests';
import { Span } from 'types';

const useLatencyRanks = () => {
  const [state, setState] = useState({});

  const fetchSpanLatencyRank = (span: Span) => {
    getLatencyRank(span).then((latencyRank) => {
      setState((prevState) => ({
        ...prevState,
        [span.spanId]: latencyRank,
      }));
    });
  };

  return {
    fetchSpanLatencyRank,
    state,
  };
};

export default useLatencyRanks;
