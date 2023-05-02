import { TableColumn } from 'components';
import {
  delimiter,
  CloudLabelsBitmap,
  CoreLabelsBitmap,
  KubernetesLabelsBitmap,
} from 'constants';
import dayjs from 'dayjs';
import React, { ReactElement, useLayoutEffect, useRef } from 'react';
import { DateSelection, LogEvent } from 'types';
import { useLogsState, useLogsWorkbooksState } from '../hooks';
import LogsSelectedLogAttributes from '../LogsSelectedLogAttributes';
import LogsSelectedLogFingerprint from '../LogsSelectedLogFingerprint';

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
  columns: TableColumn<LogEvent>[];
  isSelectedLogFromContext?: boolean;
  logsState: ReturnType<typeof useLogsState>;
  logsWorkbooksState: ReturnType<typeof useLogsWorkbooksState>;
  selectedLog?: LogEvent;
  setSelectedLog: (log: LogEvent) => void;
};

const LogsTableRowSelectedLog = ({
  columns,
  isSelectedLogFromContext,
  logsState,
  logsWorkbooksState,
  selectedLog,
}: Props): ReactElement => {
  const elementRef = useRef<HTMLTableRowElement>(null);
  const { facets, fpHash, labels } = selectedLog;

  const showInContext = () => {
    const endTime = dayjs(selectedLog.timestamp).add(1, 'second');
    const date: DateSelection = {
      startTimeUnix: endTime.subtract(5, 'minute').unix(),
      endTimeUnix: endTime.unix(),
    };

    const selectedFacetValues = kubernetesFacets
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

    logsWorkbooksState.showInContext({
      logsState: { date, selectedFacetValues },
      selectedLogFromContext: selectedLog,
    });
  };

  const kubernetesFacets = filterLabelsInBitmap(labels, KubernetesLabelsBitmap);
  const cloudFacets = filterLabelsInBitmap(labels, CloudLabelsBitmap);
  const additionalFacets = filterLabelsNotInBitmap(labels, {
    ...CloudLabelsBitmap,
    ...CoreLabelsBitmap,
    ...KubernetesLabelsBitmap,
  });

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element && isSelectedLogFromContext) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, []);

  return (
    <tr ref={elementRef}>
      <td colSpan={columns.length}>
        <div className="logs__selected-log">
          <div className="logs__selected-log__inner">
            <div className="logs__selected-log__body">
              <div className="logs__selected-log__section">
                <div className="logs__selected-log__message">
                  <div className="logs__selected-log__message__main">
                    <div className="logs__selected-log__message__text text--prewrap">
                      {selectedLog.message}
                    </div>
                  </div>
                  <button
                    className="logs__selected-log__message__context-button button button--short"
                    onClick={showInContext}
                  >
                    Show in context
                  </button>
                </div>
              </div>
              <div>
                <div className="logs__selected-log__section">
                  <div className="logs__selected-log__section__header">
                    Fingerprint
                  </div>
                  {selectedLog.fpHash ? (
                    <LogsSelectedLogFingerprint
                      fpHash={selectedLog.fpHash}
                      fpPattern={selectedLog.fpPattern}
                      logsState={logsState}
                    />
                  ) : null}
                </div>
                <div className="logs__selected-log__section">
                  <div className="logs__selected-log__section__header">
                    Log Facets
                  </div>
                  <LogsSelectedLogAttributes
                    logFacets={
                      Object.keys(facets).map((facetName) => ({
                        name: facetName,
                        type: 'string',
                        value: facets[facetName],
                      })) || []
                    }
                    enableKeyExistsFilter
                    fpHash={fpHash}
                    logsState={logsState}
                    searchPlaceholder={'Search log facets'}
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
          </div>
        </div>
      </td>
    </tr>
  );
};

export default LogsTableRowSelectedLog;
