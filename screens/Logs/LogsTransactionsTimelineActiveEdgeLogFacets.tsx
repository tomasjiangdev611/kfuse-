import React from 'react';
import LogsSelectedLogAttributes from './LogsSelectedLogAttributes';

const LogsTransactionsTimelineActiveEdgeLogFacets = ({
  endLogEventRequest,
  logsState,
  source,
  startLogEventRequest,
  target,
}) => {

  const startLogEventFacets = startLogEventRequest.result?.facets || {};
  const endLogEventFacets = endLogEventRequest.result?.facets || {};
  return (
    <div>
      <div className="logs__transactions__timeline__active-edge__section">
        <div className="logs__transactions__timeline__active-edge__section__header">
          {`Start Fingerprint ${source}`}
        </div>
        <div className="logs__transactions__timeline__active-edge__section__body">
          <LogsSelectedLogAttributes
            logFacets={Object.keys(startLogEventFacets).map((facetName) => ({
              name: facetName,
              type: 'string',
              value: startLogEventFacets[facetName],
            }))}
            logsState={logsState}
            searchPlaceholder="Search Start Log Facets"
            source={startLogEventRequest.result?.source}
          />
        </div>
      </div>
      <div className="logs__transactions__timeline__active-edge__section">
        <div className="logs__transactions__timeline__active-edge__section__header">
          {`End Fingerprint ${target}`}
        </div>
        <div className="logs__transactions__timeline__active-edge__section__body">
          <LogsSelectedLogAttributes
            logFacets={Object.keys(endLogEventFacets).map((facetName) => ({
              name: facetName,
              type: 'string',
              value: endLogEventFacets[facetName],
            }))}
            logsState={logsState}
            searchPlaceholder="Search End Log Facets"
            source={endLogEventRequest.result?.source}
          />
        </div>
      </div>
    </div>
  );
};

export default LogsTransactionsTimelineActiveEdgeLogFacets;
