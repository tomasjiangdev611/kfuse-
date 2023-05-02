import { CopyButton, Key } from 'components';
import {
  delimiter,
  keyCodes,
  CloudLabelsBitmap,
  CoreLabelsBitmap,
  KubernetesLabelsBitmap,
} from 'constants';
import dayjs from 'dayjs';
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { DateSelection } from 'types';
import { clamp, formatLogMessage } from 'utils';
import { useLogsState, useLogsWorkbooksState } from './hooks';
import LogsMessage from './LogsMessage';
import LogsSelectedLogAttributes from './LogsSelectedLogAttributes';
import LogsSelectedLogFingerprint from './LogsSelectedLogFingerprint';
import { SelectedLog } from './types';

const mapLabelAsFacetName = (labelsMap) => (labelName) => ({
  name: labelName,
  type: 'string',
  value: labelsMap[labelName],
});

const filterLabelsInBitmap = (labelsMap, bitmap) =>
  Object.keys(labelsMap)
    .filter((labelName) => bitmap[labelName])
    .map(mapLabelAsFacetName(labelsMap));

const filterLabelsNotInBitmap = (labelsMap, bitmap) =>
  Object.keys(labelsMap)
    .filter((labelName) => !bitmap[labelName])
    .map(mapLabelAsFacetName(labelsMap));

type Props = {
  logsState: ReturnType<typeof useLogsState>;
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  selectedLog: SelectedLog;
  setSelectedLog: Dispatch<SetStateAction<SelectedLog>>;
};

const LogsTableRowSelectedLog = ({
  logsState,
  logsWorkbooksState,
  selectedLog,
  setSelectedLog,
}: Props): ReactElement => {
  const elementRef = useRef<HTMLDivElement>();
  const logEvent = selectedLog.logs[selectedLog.index];
  const formattedLogMessage = useMemo(
    () => formatLogMessage(logEvent.message),
    [selectedLog],
  );
  const { facets, fpHash, labels } = logEvent;

  const showInContext = () => {
    const endTime = dayjs(logEvent.timestamp).add(1, 'second');
    const date: DateSelection = {
      startTimeUnix: endTime.subtract(5, 'minute').unix(),
      endTimeUnix: endTime.unix(),
    };

    const searchParams = new URLSearchParams();

    searchParams.set('date', JSON.stringify(date));

    const selectedFacetValues: { [key: string]: number } = kubernetesFacets
      .filter((facetName) => labels[facetName.name])
      .reduce((obj, facetName) => {
        const facetKey = `Kubernetes${delimiter}${facetName.name}`;
        const facetValueCompositeKey = `${facetKey}${delimiter}${
          labels[facetName.name]
        }`;
        return {
          ...obj,
          [facetValueCompositeKey]: 1,
        };
      }, {});

    if (labels.cluster_name) {
      const clusterNameCompositeKey = `Cloud${delimiter}cluster_name${delimiter}${labels.cluster_name}`;
      selectedFacetValues[clusterNameCompositeKey] = 1;
    }

    searchParams.set(
      'selectedFacetValues',
      JSON.stringify(selectedFacetValues),
    );

    const url = window.location.href.split('?')[0];
    window.open(`${url}?${searchParams.toString()}`, '_blank');
  };

  const kubernetesFacets = filterLabelsInBitmap(labels, KubernetesLabelsBitmap);
  const cloudFacets = filterLabelsInBitmap(labels, CloudLabelsBitmap);
  const additionalFacets = filterLabelsNotInBitmap(labels, {
    ...CloudLabelsBitmap,
    ...CoreLabelsBitmap,
    ...KubernetesLabelsBitmap,
  });

  const prev = () => {
    setSelectedLog((prevSelectedLog) => ({
      ...prevSelectedLog,
      index: clamp(
        prevSelectedLog.index - 1,
        0,
        prevSelectedLog.logs.length - 1,
      ),
    }));
  };

  const next = () => {
    setSelectedLog((prevSelectedLog) => ({
      ...prevSelectedLog,
      index: clamp(
        prevSelectedLog.index + 1,
        0,
        prevSelectedLog.logs.length - 1,
      ),
    }));
  };

  useEffect(() => {
    const listener = (e) => {
      const { keyCode } = e;

      switch (keyCode) {
        case keyCodes.LEFT:
          prev();
          return;
        case keyCodes.RIGHT:
          next();
          return;
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.click();
    }
  }, []);

  return (
    <div className="logs__selected-log" ref={elementRef}>
      <div className="logs__selected-log__header flex">
        <div className="flex__left">
          <div className="logs__selected-log__navigator">
            <div className="text--weight-medium">{`${
              selectedLog.index + 1
            } of ${selectedLog.logs.length} logs`}</div>
            <div className="logs__selected-log__navigator__keys">
              <Key keyCode={keyCodes.LEFT} onClick={prev} text="←" />
              <Key keyCode={keyCodes.RIGHT} onClick={next} text="→" />
            </div>
          </div>
        </div>
        <button
          className="logs__selected-log__message__context-button button button--short"
          onClick={showInContext}
        >
          Show in context
        </button>
      </div>
      <div className="logs__selected-log__section">
        <div className="logs__selected-log__message">
          <div className="logs__selected-log__message__main">
            <div className="logs__selected-log__message__text text--prewrap">
              <LogsMessage logEvent={logEvent} />
            </div>
            <div className="logs__selected-log__message__copy-button">
              <CopyButton text={formattedLogMessage} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="logs__selected-log__section">
          <div className="logs__selected-log__section__header">Fingerprint</div>
          {logEvent.fpHash ? (
            <LogsSelectedLogFingerprint
              fpHash={logEvent.fpHash}
              fpPattern={logEvent.fpPattern}
              logsState={logsState}
            />
          ) : null}
        </div>
        <div className="logs__selected-log__section">
          <div className="logs__selected-log__section__header">Log Facets</div>
          <LogsSelectedLogAttributes
            logFacets={
              Object.keys(facets || {}).map((facetName) => ({
                name: facetName,
                type: 'string',
                value: facets[facetName],
              })) || []
            }
            enableKeyExistsFilter
            fpHash={fpHash}
            logsState={logsState}
            searchPlaceholder={'Search logs facets'}
            source={labels.source}
          />
        </div>
        <div className="logs__selected-log__section">
          <div className="logs__selected-log__section__header">
            Kubernetes Labels
          </div>
          <LogsSelectedLogAttributes
            logsState={logsState}
            logFacets={kubernetesFacets}
            searchPlaceholder={'Search Kubernetes labels'}
            source="Kubernetes"
          />
        </div>
        <div className="logs__selected-log__section">
          <div className="logs__selected-log__section__header">
            Cloud Labels
          </div>
          <LogsSelectedLogAttributes
            logFacets={cloudFacets}
            logsState={logsState}
            searchPlaceholder={'Search Cloud Labels'}
            source="Cloud"
          />
        </div>
        <div className="logs__selected-log__section">
          <div className="logs__selected-log__section__header">
            Additional Labels
          </div>
          <LogsSelectedLogAttributes
            logFacets={additionalFacets}
            logsState={logsState}
            searchPlaceholder={'Search Additional Labels'}
            source="Additional"
          />
        </div>
      </div>
    </div>
  );
};

export default LogsTableRowSelectedLog;
