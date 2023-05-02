import React from 'react';
import { Span } from 'types';
import FlamegraphSpan from './FlamegraphSpan';
import { SpanBitMap, SpanRows } from './types';

type Props = {
  clickedSpanId?: string;
  getColor: (span: Span) => string;
  highlightedSpanBitmap: { [key: string]: number };
  hoveredSpanId?: string;
  minPresentationalSpanDuration: number;
  minStartTimeNs: number;
  maxEndTimeNs: number;
  scrollLeft?: number;
  setClickedSpanId?: (spanId: string) => void;
  setHoveredSpanId?: (spanId: string) => void;
  spanBitMap: SpanBitMap;
  spanRows: SpanRows;
  width: number;
};

const FlamegraphRows = ({
  clickedSpanId,
  getColor,
  highlightedSpanBitmap,
  hoveredSpanId,
  minPresentationalSpanDuration,
  minStartTimeNs,
  maxEndTimeNs,
  scrollLeft,
  setClickedSpanId,
  setHoveredSpanId,
  spanBitMap,
  spanRows,
  width,
}: Props) => {
  const onClickHandler = (spanId: string) => () => {
    if (setClickedSpanId) {
      setClickedSpanId(spanId);
    }
  };

  const onMouseEnterHandler = (spanId: string) => () => {
    if (setHoveredSpanId) {
      setHoveredSpanId(spanId);
    }
  };

  const onMouseLeave = () => {
    setHoveredSpanId(null);
  };

  return (
    <div className="flamegraph__rows">
      {spanRows.map((spanRow, i) => (
        <div className="flamegraph__row" key={i}>
          {spanRow.map((spanId) => (
            <FlamegraphSpan
              clickedSpanId={clickedSpanId}
              getColor={getColor}
              highlightedSpanBitmap={highlightedSpanBitmap}
              hoveredSpanId={hoveredSpanId}
              key={spanId}
              minPresentationalSpanDuration={minPresentationalSpanDuration}
              minStartTimeNs={minStartTimeNs}
              maxEndTimeNs={maxEndTimeNs}
              onClick={onClickHandler(spanId)}
              onMouseEnter={onMouseEnterHandler(spanId)}
              onMouseLeave={onMouseLeave}
              scrollLeft={scrollLeft}
              span={spanBitMap[spanId]}
              spanId={spanId}
              width={width}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FlamegraphRows;
