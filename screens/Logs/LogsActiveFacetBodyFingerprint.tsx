import { PopoverTrigger } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { logSample } from 'requests';

import { useLogsState } from './hooks';
import LogsFingerprintsListItemPanel from './LogsFingerprintsListItemPanel';

const LogsActiveFacetBodyFingerprint = ({
  fingerprint,
  logsState,
}: {
  fingerprint: any;
  logsState: ReturnType<typeof useLogsState>;
}): ReactElement => {
  const logSampleRequest = useRequest(logSample);

  const {
    date,
    selectedFacetValues,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  } = logsState;

  useEffect(() => {
    logSampleRequest.call({
      date,
      selectedFacetValues,
      filterOrExcludeByFingerprint,
      fingerprint: fingerprint.hash,
      keyExists,
      searchTerms,
    });
  }, [
    date,
    selectedFacetValues,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  ]);

  return (
    <div className="logs__active-facet__fingerprints__item__pattern">
      <PopoverTrigger
        className="link"
        component={LogsFingerprintsListItemPanel}
        props={{
          fingerprint,
          hash: fingerprint.hash,
          logsState,
          onExclude: () => {},
          onFilter: () => {},
        }}
        width={240}
      >
        {logSampleRequest.result?.fpPattern}
      </PopoverTrigger>
      {logSampleRequest.result?.message ? (
        <div className="text--prewrap">{logSampleRequest.result.message}</div>
      ) : null}
    </div>
  );
};

export default LogsActiveFacetBodyFingerprint;
