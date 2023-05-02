import { Loader } from 'components';
import { useRequest } from 'hooks';
import debounce from 'lodash.debounce';
import React, { ReactElement, useRef, useState } from 'react';
import { getFpList } from 'requests';
import LogsFingerprintsListItem from './LogsFingerprintsListItem';
import {
  useLogsState,
  useQueryScheduler,
  useQuerySchedulerEffect,
} from './hooks';

const LogsFingerprintsList = ({
  logsState,
  queryScheduler,
}: {
  logsState: ReturnType<typeof useLogsState>;
  queryScheduler: ReturnType<typeof useQueryScheduler>;
}): ReactElement => {
  const getFpListRequest = useRequest(getFpList);
  const {
    date,
    selectedFacetValues,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  } = logsState;

  const fetchFpList = () =>
    getFpListRequest.call({
      date,
      selectedFacetValues,
      filterOrExcludeByFingerprint,
      keyExists,
      searchTerms,
    });

  useQuerySchedulerEffect({
    cb: fetchFpList,
    logsState,
    queryScheduler,
    tab: 'fingerprint',
  });

  const elementRef = useRef(null);
  const [lastIndex, setLastIndex] = useState(100);

  const onScroll = debounce(() => {
    const element = elementRef.current;
    if (element) {
      const { offsetHeight, scrollHeight, scrollTop } = element;
      if (scrollTop > scrollHeight - offsetHeight - 40) {
        setLastIndex((prevLastIndex) => prevLastIndex + 100);
      }
    }
  }, 200);

  return (
    <Loader
      className="logs__fingerprints-list"
      isLoading={getFpListRequest.isLoading}
      onScroll={onScroll}
      ref={elementRef}
    >
      <div className="logs__fingerprints-list__body">
        {(getFpListRequest.result || [])
          .slice(0, lastIndex)
          .map((fingerprint) => (
            <LogsFingerprintsListItem
              fingerprint={fingerprint}
              key={`${fingerprint.source}:${fingerprint.hash}`}
              logsState={logsState}
            />
          ))}
      </div>
    </Loader>
  );
};

export default LogsFingerprintsList;
