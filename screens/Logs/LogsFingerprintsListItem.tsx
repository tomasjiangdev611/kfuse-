import { Loader } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { getLogStackedBarCountsUsingMetrics, logSample } from 'requests';
import { Fingerprint } from 'types';
import { convertNumberToReadableUnit, formatNumber } from 'utils';
import { useLogsState } from './hooks';
import LogsFingerprintsListItemMain from './LogsFingerprintsListItemMain';
import LogsFingerprintsListItemChart from './LogsFingerprintsListItemChart';

const WIDTH = 100;

const getBarCount = (width: number) => Math.ceil(width / 4) + 1;

const getBucketSecs = (
  startTimeUnix: number,
  endTimeUnix: number,
  width: number,
) => {
  const barCount = getBarCount(width);
  return Math.max(Math.round((endTimeUnix - startTimeUnix) / barCount), 1);
};

type Props = {
  fingerprint: Fingerprint;
  logsState: ReturnType<typeof useLogsState>;
};

const LogsFingerprintsListItem = ({
  fingerprint,
  logsState,
}: Props): ReactElement => {
  const fetchedRef = useRef(false);
  const { hash } = fingerprint;
  const {
    date,
    selectedFacetValues,
    filterOrExcludeByFingerprint,
    keyExists,
    searchTerms,
  } = logsState;
  const bucketSecs = getBucketSecs(date.startTimeUnix, date.endTimeUnix, WIDTH);
  const getLogCountsRequest = useRequest(getLogStackedBarCountsUsingMetrics);
  const logSampleRequest = useRequest(logSample);

  const onChange = (isVisible: boolean) => {
    if (isVisible && !fetchedRef.current) {
      fetchedRef.current = true;
      getLogCountsRequest.call({
        bucketSecs,
        date,
        selectedFacetValues,
        filterOrExcludeByFingerprint: { [hash]: true },
        keyExists,
        searchTerms,
      });

      logSampleRequest.call({
        date,
        selectedFacetValues,
        filterOrExcludeByFingerprint,
        fingerprint: hash,
        keyExists,
        searchTerms,
      });
    }
  };

  const message = logSampleRequest.result?.message;
  const pattern = logSampleRequest.result?.fpPattern;

  return (
    <VisibilitySensor onChange={onChange}>
      <div className="logs__fingerprints-list__item">
        <div className="logs__fingerprints-list__item__source">
          {fingerprint.source}
        </div>
        <LogsFingerprintsListItemMain
          fingerprint={fingerprint}
          logsState={logsState}
          message={message || null}
          pattern={pattern || null}
        />
        <div
          className="logs__fingerprints-list__item__count"
          data-tooltip={formatNumber(fingerprint.count)}
        >
          {convertNumberToReadableUnit(fingerprint.count)}
        </div>
        <Loader
          className="logs__fingerprints-list__item__chart"
          isLoading={getLogCountsRequest.isLoading}
        >
          <LogsFingerprintsListItemChart
            bucketSecs={bucketSecs}
            date={date}
            logCounts={getLogCountsRequest.result || []}
            width={WIDTH}
          />
        </Loader>
      </div>
    </VisibilitySensor>
  );
};

export default LogsFingerprintsListItem;
