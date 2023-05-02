import { KubernetesLabelsBitmap } from 'constants';
import React from 'react';
import LogsSelectedLogAttributes from './LogsSelectedLogAttributes';

const mapLabelAsFacetName = (labelsMap) => (labelName) => ({
  name: labelName,
  type: 'string',
  value: labelsMap[labelName],
});

const filterLabelsInKubernetesBitMap = (labelsMap) =>
  Object.keys(labelsMap)
    .filter((labelName) => labelsMap[labelName] && KubernetesLabelsBitmap[labelName])
    .map(mapLabelAsFacetName(labelsMap));

const LogsTransactionsTimelineActiveEdgeKubernetes = ({
  endLogEventRequest,
  logsState,
  source,
  startLogEventRequest,
  target,
}) => {
  const startLogEventKubernetesFacets = filterLabelsInKubernetesBitMap(
    startLogEventRequest.result?.labels || {},
  );
  const endLogEventKubernetesFacets = filterLabelsInKubernetesBitMap(
    endLogEventRequest.result?.labels || {},
  );

  return (
    <div>
      <div className="logs__transactions__timeline__active-edge__section">
        <div className="logs__transactions__timeline__active-edge__section__header">
          {`Start Fingerprint ${source}`}
        </div>
        <div className="logs__transactions__timeline__active-edge__section__body">
          <LogsSelectedLogAttributes
            logsState={logsState}
            logFacets={startLogEventKubernetesFacets}
            searchPlaceholder={'Search Start Kubernetes labels'}
            source="Kubernetes"
          />
        </div>
      </div>
      <div className="logs__transactions__timeline__active-edge__section">
        <div className="logs__transactions__timeline__active-edge__section__header">
          {`End Fingerprint ${target}`}
        </div>
        <div className="logs__transactions__timeline__active-edge__section__body">
          <LogsSelectedLogAttributes
            logsState={logsState}
            logFacets={endLogEventKubernetesFacets}
            searchPlaceholder={'Search End Kubernetes labels'}
            source="Kubernetes"
          />
        </div>
      </div>
    </div>
  );
};

export default LogsTransactionsTimelineActiveEdgeKubernetes;
