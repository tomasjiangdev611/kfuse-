import React from 'react';
import { FlameGraph } from 'react-flame-graph';
import { Span } from 'types';
import { formatNs, getUnit } from 'utils';
import { SpanNode } from '../types';

const niceNum = (range: number, round: boolean) => {
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
};

const niceScale = (
  lowerBound: number,
  upperBound: number,
  maxTicks: number,
) => {
  const range = niceNum(upperBound - lowerBound, false);
  const tickSpacing = niceNum(range / (maxTicks - 1), true);
  const niceLowerBound = Math.floor(lowerBound / tickSpacing) * tickSpacing;
  const niceUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;

  return { niceLowerBound, niceUpperBound, tickSpacing };
};

export const getTicks = (
  niceUpperBound: number,
  tickSpacing: number,
): number[] => {
  const result = [];

  for (let i = 0; i < niceUpperBound / tickSpacing; i += 1) {
    result.push(i * tickSpacing);
  }

  return result;
};

const getMinMaxInNs = (spans: Span[]) => {
  const startTimeNs = Math.min(...spans.map((span) => span.startTimeNs));
  const endTimeNs = Math.max(...spans.map((span) => span.endTimeNs));

  return {
    startTimeNs,
    endTimeNs,
  };
};

type Props = {
  setClickedSpanId: (spanId: string) => void;
  setHoveredSpanId: (spanId: string) => void;
  spans: Span[];
  spanTree: SpanNode;
  width: number;
};

const TraceSidebarFlameGraph = ({
  setClickedSpanId,
  setHoveredSpanId,
  spans,
  spanTree,
  width,
}: Props) => {
  const { startTimeNs, endTimeNs } = getMinMaxInNs(spans);
  const diffInNs = endTimeNs - startTimeNs;
  const unit = getUnit(diffInNs);
  const min = 0;
  const { niceUpperBound, tickSpacing } = niceScale(min, diffInNs, 8);
  const numTicks = isNaN(niceUpperBound) ? 0 : niceUpperBound / tickSpacing;

  return (
    <div
      className="trace-sidebar__flame-graph"
      onMouseLeave={() => {
        setHoveredSpanId(null);
      }}
    >
      <div className="trace-sidebar__flame-graph__ticks">
        {numTicks ? (
          new Array(numTicks).fill(null).map((_, i) => (
            <div className="trace-sidebar__flame-graph__ticks__item" key={i}>
              <div className="trace-sidebar__flame-graph__ticks__item__label">
                <div className="trace-sidebar__flame-graph__ticks__item__label__text">
                  {`${formatNs(min + i * tickSpacing, unit)}${unit}`}
                </div>
              </div>
              {i === numTicks - 1 ? (
                <div className="trace-sidebar__flame-graph__ticks__item__label trace-sidebar__flame-graph__ticks__item__label--right">
                  <div className="trace-sidebar__flame-graph__ticks__item__label__text">
                    {`${formatNs(diffInNs, unit)}${unit}`}
                  </div>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="trace-sidebar__flame-graph__ticks__item">
            <div className="trace-sidebar__flame-graph__ticks__item__label">
              <div className="trace-sidebar__flame-graph__ticks__item__label__text">
                {'0ns'}
              </div>
            </div>
          </div>
        )}
      </div>
      {spanTree ? (
        <FlameGraph
          data={spanTree}
          height={300}
          onChange={(node) => {
            setClickedSpanId(node.source.spanId);
          }}
          onMouseOut={() => {
            setHoveredSpanId(null);
          }}
          onMouseOver={(_, node: SpanNode) => {
            setHoveredSpanId(node.spanId);
          }}
          width={width}
        />
      ) : null}
    </div>
  );
};

export default TraceSidebarFlameGraph;
