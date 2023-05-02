import classnames from 'classnames';
import { Checkbox } from 'components';
import { useToggle } from 'hooks';
import React from 'react';
import { ChevronDown, ChevronRight } from 'react-feather';
import { Edge, PathStat, PercentileDuration } from 'types';
import { useTransactionSelector } from './hooks';
import LogsTransactionsTimelineEdgesInfo from './LogsTransactionsTimelineEdgesInfo';
import { formatMilliseconds } from './utils';

const maxWidth = 400;

type Props = {
  path: PathStat;
  setActiveEdge: (args: {
    edge: Edge;
    percentileDuration: PercentileDuration;
  }) => void;
  totalDuration: number;
  transactionSelector: ReturnType<typeof useTransactionSelector>;
};

const LogsTransactionsTimelineEdges = ({
  path,
  setActiveEdge,
  totalDuration,
  transactionSelector,
}: Props) => {
  const expandedToggle = useToggle();
  const { selectedFpBitmap, toggleFpHash } = transactionSelector;

  const toggleFpHashHandler = (fpHash: string) => () => {
    toggleFpHash(fpHash);
  };

  const { percentileDurations } = path;

  const startFp = path.edges[0].startFp || null;
  const endFp = path.edges[path.edges.length - 1]?.endFp || null;
  const totalTime = path.edges.reduce((sum, edge) => sum + edge.hopTime, 0);

  const percentileDuration = percentileDurations.find(
    (percentileDuration) => percentileDuration.percentileLabel === 'p90',
  );

  const setActiveEdgeHandler = (edge: Edge) => () => {
    setActiveEdge({ edge, percentileDuration });
  };

  return (
    <div className="logs__transactions__timeline__edges">
      <div
        className={classnames({
          logs__transactions__timeline__edge: true,
          'logs__transactions__timeline__edge--outer': true,
        })}
        onClick={expandedToggle.toggle}
      >
        <div className="logs__transactions__timeline__edge__left">
          <div className="logs__transactions__timeline__edge__gutter">
            <div className="logs__transactions__timeline__edge__gutter__padder" />
            <div className="logs__transactions__timeline__edge__count">
              <div className="logs__transactions__timeline__edge__count__label">
                {path.edges.length + 1}
              </div>
              <div className="logs__transactions__timeline__edge__count__icon">
                {expandedToggle.value ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            </div>
            <div className="logs__transactions__timeline__edge__gutter__padder">
              {expandedToggle.value ? (
                <div className="logs__transactions__timeline__edge__gutter__padder__line" />
              ) : null}
            </div>
          </div>
          <div className="logs__transactions__timeline__edge__info">
            {startFp ? (
              <LogsTransactionsTimelineEdgesInfo
                hash={startFp}
                onClick={() => {}}
              />
            ) : null}
            {endFp ? (
              <LogsTransactionsTimelineEdgesInfo
                hash={endFp}
                onClick={() => {}}
              />
            ) : null}
          </div>
        </div>
        <div className="logs__transactions__timeline__edge__right">
          <div
            className="logs__transactions__timeline__edge__head"
            style={{
              width: 0,
            }}
          />
          <div
            className="logs__transactions__timeline__edge__line"
            style={{
              width: `${(totalTime / totalDuration) * maxWidth}px`,
            }}
          >
            <div className="logs__transactions__timeline__edge__line__number">
              {formatMilliseconds(totalTime)}
            </div>
          </div>
          <div className="logs__transactions__timeline__edge__tail" />
        </div>
      </div>
      {expandedToggle.value ? (
        <>
          {path.edges.length ? (
            <div
              className={classnames({
                logs__transactions__timeline__edge: true,
                'logs__transactions__timeline__edge--inner': true,
              })}
              onClick={setActiveEdgeHandler(path.edges[0])}
            >
              <div className="logs__transactions__timeline__edge__left">
                <div className="logs__transactions__timeline__inner-edge__gutter">
                  <div className="logs__transactions__timeline__inner-edge__gutter__line" />
                  <div
                    className={classnames({
                      'logs__transactions__timeline__inner-edge__gutter__line':
                        true,
                    })}
                  />
                </div>
                <div className="logs__transactions__timeline__inner-edge__count">
                  <Checkbox
                    onChange={toggleFpHashHandler(path.edges[0].startFp)}
                    value={Boolean(selectedFpBitmap[path.edges[0].startFp])}
                  />
                </div>
                <div className="logs__transactions__timeline__edge__info">
                  {path.edges[0].startFp}
                </div>
              </div>
              <div className="logs__transactions__timeline__edge__right" />
            </div>
          ) : null}
          {path.edges.map((edge, i) => (
            <div
              className={classnames({
                logs__transactions__timeline__edge: true,
                'logs__transactions__timeline__edge--inner': true,
              })}
              key={`${edge.startFp}:${edge.endFp}}`}
              onClick={setActiveEdgeHandler(edge)}
            >
              <div className="logs__transactions__timeline__edge__left">
                <div className="logs__transactions__timeline__inner-edge__gutter">
                  <div className="logs__transactions__timeline__inner-edge__gutter__line" />
                  <div
                    className={classnames({
                      'logs__transactions__timeline__inner-edge__gutter__line':
                        true,
                      'logs__transactions__timeline__inner-edge__gutter__line--hide':
                        i === path.edges.length - 1,
                    })}
                  />
                </div>
                <div className="logs__transactions__timeline__inner-edge__count">
                  <Checkbox
                    onChange={toggleFpHashHandler(edge.endFp)}
                    value={Boolean(selectedFpBitmap[edge.endFp])}
                  />
                </div>
                <div className="logs__transactions__timeline__edge__info">
                  {edge.endFp}
                </div>
              </div>
              <div className="logs__transactions__timeline__edge__right">
                <div
                  className="logs__transactions__timeline__edge__head"
                  style={{
                    width: `${
                      (path.edges
                        .slice(0, i)
                        .reduce((sum, e) => sum + e.hopTime, 0) /
                        totalDuration) *
                      maxWidth
                    }px`,
                  }}
                />
                <div
                  className="logs__transactions__timeline__edge__line logs__transactions__timeline__edge__line--purple"
                  style={{
                    width: `${Math.max(
                      (edge.hopTime / totalDuration) * maxWidth,
                      1,
                    )}px`,
                  }}
                >
                  <div className="logs__transactions__timeline__edge__line__number">
                    {formatMilliseconds(edge.hopTime)}
                  </div>
                </div>
                <div className="logs__transactions__timeline__edge__tail" />
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default LogsTransactionsTimelineEdges;
