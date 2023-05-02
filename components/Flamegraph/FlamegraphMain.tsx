import { useToggle } from 'hooks';
import React, { useMemo, useRef, useState } from 'react';
import { Span } from 'types';
import getHighlightedSpanBitmap from './getHighlightedSpanBitmap';
import getSpanRows from './getSpanRows';
import FlamegraphInner from './FlamegraphInner';
import FlamegraphRows from './FlamegraphRows';
import FlamegraphTicks from './FlamegraphTicks';
import FlamegraphTools from './FlamegraphTools';
import { Zoom } from './types';
import { clampScale } from './utils';
import ShiftToZoomHelperText from '../ShiftToZoomHelperText';

type Props = {
  baseWidth: number;
  clickedSpanId?: string;
  getColor: (span: Span) => string;
  hoveredSpanId?: string;
  setClickedSpanId: (spanId: string) => void;
  setHoveredSpanId: (spanId: string) => void;
  spans: Span[];
};

const FlamegraphMain = ({
  baseWidth,
  clickedSpanId,
  getColor,
  hoveredSpanId,
  setClickedSpanId,
  setHoveredSpanId,
  spans,
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [zoom, setZoom] = useState<Zoom>({
    scale: 1,
  });
  const showMapToggle = useToggle();
  const width = Math.max(baseWidth * zoom.scale, baseWidth);

  const {
    minPresentationalSpanDuration,
    minStartTimeNs,
    maxEndTimeNs,
    niceUpperBound,
    spanBitMap,
    spanRows,
    tickSpacing,
  } = useMemo(
    () =>
      getSpanRows({
        scale: zoom.scale,
        spans,
        width,
      }),
    [spans, width, zoom],
  );

  const onScroll = (e) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const onWheel = (e) => {
    if (e.shiftKey) {
      e.preventDefault();
      if (!showMapToggle.value) {
        showMapToggle.on();
      }

      const delta = -e.deltaY;
      if (Math.abs(delta) > 5) {
        setZoom((prevZoom) => {
          const { scale } = prevZoom;

          const nextScale = delta > 0 ? scale * 1.025 : scale / 1.025;

          return {
            scale: clampScale(nextScale),
          };
        });
      }
    }
  };

  const highlightedSpanBitmap = useMemo(
    () => getHighlightedSpanBitmap(clickedSpanId || hoveredSpanId, spans),
    [clickedSpanId, hoveredSpanId, spans],
  );

  return (
    <>
      <FlamegraphInner
        baseWidth={baseWidth}
        elementRef={elementRef}
        onScroll={onScroll}
        zoom={zoom}
      >
        <div
          className="flamegraph__visualization"
          onWheel={onWheel}
          style={{
            minHeight: `${(spanRows.length + 3) * 24}px`,
            width: `${width}px`,
          }}
        >
          <FlamegraphTicks
            minStartTimeNs={minStartTimeNs}
            maxEndTimeNs={maxEndTimeNs}
            niceUpperBound={niceUpperBound}
            tickSpacing={tickSpacing}
            width={width}
          />
          <FlamegraphRows
            clickedSpanId={clickedSpanId}
            getColor={getColor}
            highlightedSpanBitmap={highlightedSpanBitmap}
            hoveredSpanId={hoveredSpanId}
            minPresentationalSpanDuration={minPresentationalSpanDuration}
            minStartTimeNs={minStartTimeNs}
            maxEndTimeNs={maxEndTimeNs}
            setClickedSpanId={setClickedSpanId}
            setHoveredSpanId={setHoveredSpanId}
            scrollLeft={scrollLeft}
            spanBitMap={spanBitMap}
            spanRows={spanRows}
            width={width}
          />
        </div>
      </FlamegraphInner>
      <FlamegraphTools
        baseWidth={baseWidth}
        elementRef={elementRef}
        getColor={getColor}
        highlightedSpanBitmap={highlightedSpanBitmap}
        hoveredSpanId={hoveredSpanId}
        minPresentationalSpanDuration={minPresentationalSpanDuration}
        minStartTimeNs={minStartTimeNs}
        maxEndTimeNs={maxEndTimeNs}
        scrollLeft={scrollLeft}
        setZoom={setZoom}
        showMapToggle={showMapToggle}
        spanBitMap={spanBitMap}
        spanRows={spanRows}
        width={width}
        zoom={zoom}
      />
      <div className="flamegraph__helper-text">
        <ShiftToZoomHelperText />
      </div>
    </>
  );
};

export default FlamegraphMain;
