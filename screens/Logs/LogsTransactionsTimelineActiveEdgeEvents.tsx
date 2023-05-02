import React from 'react';

const LogsTransactionsTimelineActiveEdgeEvents = ({
  endLogEventRequest,
  source,
  startLogEventRequest,
  target,
}) => {
  return (
    <div>
      <div className="logs__transactions__timeline__active-edge__section">
        <div className="logs__transactions__timeline__active-edge__section__header">
          {`Start Fingerprint ${source}`}
        </div>
        <div className="logs__transactions__timeline__active-edge__section__body text--monospace">
          {startLogEventRequest.result
            ? startLogEventRequest.result.message
            : null}
        </div>
      </div>
      <div className="logs__transactions__timeline__active-edge__section">
        <div className="logs__transactions__timeline__active-edge__section__header">
          {`End Fingerprint ${target}`}
        </div>
        <div className="logs__transactions__timeline__active-edge__section__body text--monospace">
          {endLogEventRequest.result ? endLogEventRequest.result.message : null}
        </div>
      </div>
    </div>
  );
};

export default LogsTransactionsTimelineActiveEdgeEvents;
