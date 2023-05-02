import React, { useState } from 'react';
import { PathStat } from 'types';
import { useLogsState, useTransactionSelector } from './hooks';
import LogsTransactionsTimelineActiveEdge from './LogsTransactionsTimelineActiveEdge';
import LogsTransactionsTimelineEdges from './LogsTransactionsTimelineEdges';
import LogsTransactionsTimelineSave from './LogsTransactionsTimelineSave';
import LogsTransactionsTimelineScale from './LogsTransactionsTimelineScale';
import { niceScale } from './utils';

type Props = {
  logsState: ReturnType<typeof useLogsState>;
  paths: PathStat[];
};

const LogsTransactionsTimelineBody = ({ logsState, paths }: Props) => {
  const transactionSelector = useTransactionSelector();
  const { selectedFpHashes } = transactionSelector;

  const [activeEdge, setActiveEdge] = useState(null);

  const totalDuration = Math.max(
    ...paths.map((path) =>
      path.edges.reduce((sum, edgeStat) => sum + edgeStat.hopTime, 0),
    ),
  );

  const { niceUpperBound, tickSpacing } = niceScale(0, totalDuration, 10);

  const percentileDuration = paths[0]?.percentileDurations.find(
    (p) => p.percentileLabel === 'p90',
  );
  const group = percentileDuration?.example?.group || {};

  return (
    <div className="logs__transactions__timeline__body">
      <div className="logs__transactions__timeline__body__left">
        <div className="logs__transactions__timeline__body__main">
          <div className="logs__transactions__timeline__body__main__edges">
            <LogsTransactionsTimelineScale
              niceUpperBound={niceUpperBound}
              tickSpacing={tickSpacing}
              totalDuration={totalDuration}
            />
            {paths.map((path) => (
              <LogsTransactionsTimelineEdges
                key={path.pathId}
                path={path}
                setActiveEdge={setActiveEdge}
                totalDuration={totalDuration}
                transactionSelector={transactionSelector}
              />
            ))}
          </div>
        </div>
        {selectedFpHashes.length ? (
          <LogsTransactionsTimelineSave
            group={group}
            transactionSelector={transactionSelector}
          />
        ) : null}
      </div>
      {activeEdge ? (
        <LogsTransactionsTimelineActiveEdge
          activeEdge={activeEdge}
          key={`${activeEdge.edge.startFp}:${activeEdge.edge.endFp}`}
          logsState={logsState}
          setActveEdge={setActiveEdge}
        />
      ) : null}
    </div>
  );
};

export default LogsTransactionsTimelineBody;
