import React, { MutableRefObject } from 'react';
import { Span } from 'types';
import { MAP_WIDTH } from './constants';
import FlamegraphRows from './FlamegraphRows';
import FlamegraphToolsMapWindow from './FlamegraphToolsMapWindow';
import { SpanBitMap, SpanRows } from './types';

type Props = {
  baseWidth: number;
  elementRef: MutableRefObject<HTMLDivElement>;
  getColor: (span: Span) => string;
  highlightedSpanBitmap: { [key: string]: number };
  hoveredSpanId?: string;
  minPresentationalSpanDuration: number;
  minStartTimeNs: number;
  maxEndTimeNs: number;
  scrollLeft: number;
  spanBitMap: SpanBitMap;
  spanRows: SpanRows;
  width: number;
};

const FlamegraphToolsMap = ({
  baseWidth,
  elementRef,
  getColor,
  highlightedSpanBitmap,
  hoveredSpanId,
  minPresentationalSpanDuration,
  minStartTimeNs,
  maxEndTimeNs,
  scrollLeft,
  spanBitMap,
  spanRows,
  width,
}: Props) => {
  return (
    <div className="flamegraphs__tools__map">
      <FlamegraphRows
        getColor={getColor}
        highlightedSpanBitmap={highlightedSpanBitmap}
        hoveredSpanId={hoveredSpanId}
        minPresentationalSpanDuration={minPresentationalSpanDuration}
        minStartTimeNs={minStartTimeNs}
        maxEndTimeNs={maxEndTimeNs}
        spanBitMap={spanBitMap}
        spanRows={spanRows}
        width={MAP_WIDTH}
      />
      <FlamegraphToolsMapWindow
        baseWidth={baseWidth}
        elementRef={elementRef}
        scrollLeft={scrollLeft}
        width={width}
      />
    </div>
  );
};

export default FlamegraphToolsMap;
