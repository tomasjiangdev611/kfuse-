import { Tab, Tabs, useTabs } from 'components';
import { useRequest } from 'hooks';
import React, { ReactElement, useEffect } from 'react';
import { X } from 'react-feather';
import { logEventDetail, logSampleByFpHash } from 'requests';

import { useLogsState } from './hooks';
import LogsTransactionsTimelineActiveEdgeEvents from './LogsTransactionsTimelineActiveEdgeEvents';
import LogsTransactionsTimelineActiveEdgeLogFacets from './LogsTransactionsTimelineActiveEdgeLogFacets';
import LogsTransactionsTimelineActiveEdgeKubernetes from './LogsTransactionsTimelineActiveEdgeKubernetes';

// durationSecs={Math.floor(percentileDuration.example.duration / 1000)}
// endTs={percentileDuration.example.endTs}
// group={group}

const LogsTransactionsTimelineActiveEdge = ({
  activeEdge,
  logsState,
  setActveEdge,
}: {
  activeEdge: any;
  logsState: ReturnType<typeof useLogsState>;
  setActveEdge: any;
}): ReactElement => {
  const tabs = useTabs();
  const startLogEventRequest = useRequest(logSampleByFpHash);
  const endLogEventRequest = useRequest(logSampleByFpHash);
  const { edge, percentileDuration } = activeEdge;
  const { startFp, endFp } = edge;
  const durationSecs = Math.max(
    Math.ceil(percentileDuration.example.duration / 1000),
    1,
  );
  const endTs = percentileDuration?.example?.endTs;
  const group = percentileDuration?.example?.group || {};

  const close = () => {
    setActveEdge(null);
  };

  useEffect(() => {
    startLogEventRequest
      .call({ durationSecs, endTs, fpHash: startFp, group });

    endLogEventRequest
      .call({ durationSecs, endTs, fpHash: endFp, group });
  }, []);
  return (
    <div className="logs__transactions__timeline__active-edge">
      <div className="logs__transactions__timeline__active-edge__header">
        <button className="modal__header__close" onClick={close}>
          <X size={18} />
        </button>
      </div>
      <Tabs tabs={tabs}>
        <Tab label="Events">
          <LogsTransactionsTimelineActiveEdgeEvents
            endLogEventRequest={endLogEventRequest}
            source={startFp}
            startLogEventRequest={startLogEventRequest}
            target={endFp}
          />
        </Tab>
        <Tab label="Log Facets">
          <LogsTransactionsTimelineActiveEdgeLogFacets
            endLogEventRequest={endLogEventRequest}
            logsState={logsState}
            source={startFp}
            startLogEventRequest={startLogEventRequest}
            target={endFp}
          />
        </Tab>
        <Tab label="Kubernetes">
          <LogsTransactionsTimelineActiveEdgeKubernetes
            endLogEventRequest={endLogEventRequest}
            logsState={logsState}
            source={startFp}
            startLogEventRequest={startLogEventRequest}
            target={endFp}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default LogsTransactionsTimelineActiveEdge;
