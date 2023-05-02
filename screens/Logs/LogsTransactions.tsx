import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LogsTransactionsInner from './LogsTransactionsInner';

const LogsTransactions = ({ getFacetNamesRequest, logsState }) => {
  const [searchParams] = useSearchParams();
  const facetKey = searchParams.get('facetKey');
  const { date, filterOrExcludeByFingerprint } = logsState;
  const { startTimeUnix, endTimeUnix } = date;

  useEffect(() => {
    getFacetNamesRequest.call({ date, filterOrExcludeByFingerprint });
  }, [date]);

  return (
    <div className="logs__transactions">
      <LogsTransactionsInner
        facetKey={facetKey}
        facetNames={getFacetNamesRequest.result || []}
        key={`${startTimeUnix}:${endTimeUnix}`}
        logsState={logsState}
      />
    </div>
  );
};

export default LogsTransactions;
