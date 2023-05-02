import classnames from 'classnames';
import { TooltipTrigger, TooltipPosition } from 'components';
import { useToggle } from 'hooks';
import React, { MutableRefObject } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { RiZoomInLine, RiZoomOutLine } from 'react-icons/ri';
import { Span } from 'types';
import * as constants from './constants';
import FlamegraphToolsMap from './FlamegraphToolsMap';
import { SpanBitMap, SpanRows, Zoom } from './types';
import { clampScale } from './utils';

type Props = {
  baseWidth: number;
  elementRef: MutableRefObject<HTMLDivElement>;
  getColor: (span: Span) => string;
  highlightedSpanBitmap: { [key: string]: number };
  hoveredSpanId?: string;
  minPresentationalSpanDuration: number;
  minStartTimeNs: number;
  maxEndTimeNs: number;
  onScroll: VoidFunction;
  scrollLeft: number;
  setZoom: (zoom: Zoom) => void;
  showMapToggle: ReturnType<typeof useToggle>;
  spanBitMap: SpanBitMap;
  spanRows: SpanRows;
  width: number;
  zoom: Zoom;
};

const FlamegraphTools = ({
  baseWidth,
  elementRef,
  getColor,
  highlightedSpanBitmap,
  hoveredSpanId,
  minPresentationalSpanDuration,
  minStartTimeNs,
  maxEndTimeNs,
  scrollLeft,
  setZoom,
  showMapToggle,
  spanBitMap,
  spanRows,
  zoom,
  width,
}: Props) => {
  const zoomIn = () => {
    setZoom((prevZoom) => ({
      ...prevZoom,
      scale: clampScale(1.5 * prevZoom.scale),
    }));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => ({
      ...prevZoom,
      scale: clampScale(prevZoom.scale / 1.5),
    }));
  };

  return (
    <div className="flamegraph__tools">
      {showMapToggle.value ? (
        <FlamegraphToolsMap
          baseWidth={baseWidth}
          elementRef={elementRef}
          getColor={getColor}
          highlightedSpanBitmap={highlightedSpanBitmap}
          hoveredSpanId={hoveredSpanId}
          minPresentationalSpanDuration={minPresentationalSpanDuration}
          minStartTimeNs={minStartTimeNs}
          maxEndTimeNs={maxEndTimeNs}
          scrollLeft={scrollLeft}
          spanBitMap={spanBitMap}
          spanRows={spanRows}
          width={width}
        />
      ) : null}
      <div className="flamegraph__tools__buttons">
        <TooltipTrigger
          className="flamegraph__tools__buttons__item"
          position={TooltipPosition.BOTTOM}
          tooltip={`${showMapToggle.value ? 'Hide' : 'Show'} map`}
        >
          <button
            className="flamegraph__tools__buttons__item__button"
            onClick={showMapToggle.toggle}
          >
            {showMapToggle.value ? <MdExpandMore /> : <MdExpandLess />}
          </button>
        </TooltipTrigger>
        <TooltipTrigger
          className="flamegraph__tools__buttons__item"
          position={TooltipPosition.BOTTOM}
          tooltip="Zoom Out"
        >
          <button
            className={classnames({
              flamegraph__tools__buttons__item__button: true,
              'flamegraph__tools__buttons__item__button--disabled':
                zoom.scale === constants.MIN_SCALE,
            })}
            onClick={zoomOut}
          >
            <RiZoomOutLine />
          </button>
        </TooltipTrigger>
        <TooltipTrigger
          className="flamegraph__tools__buttons__item"
          position={TooltipPosition.BOTTOM}
          tooltip="Zoom In"
        >
          <button
            className={classnames({
              flamegraph__tools__buttons__item__button: true,
              'flamegraph__tools__buttons__item__button--disabled':
                zoom.scale === constants.MAX_SCALE,
            })}
            onClick={zoomIn}
          >
            <RiZoomInLine />
          </button>
        </TooltipTrigger>
      </div>
    </div>
  );
};

export default FlamegraphTools;
