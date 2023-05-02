import classnames from 'classnames';
import React from 'react';
import { BsFillExclamationSquareFill } from 'react-icons/bs';
import { Span } from 'types';
import { formatDurationNs } from 'utils';

type Props = {
  clickedSpanId?: string;
  getColor: (span: Span) => string;
  highlightedSpanBitmap: { [key: string]: number };
  hoveredSpanId?: string;
  minPresentationalSpanDuration: number;
  minStartTimeNs: number;
  maxEndTimeNs: number;
  onClick: VoidFunction;
  onMouseEnter: VoidFunction;
  onMouseLeave: VoidFunction;
  scrollLeft: number;
  span: Span;
  spanId: string;
  width: number;
};

const FlamegraphSpan = ({
  clickedSpanId,
  getColor,
  highlightedSpanBitmap,
  hoveredSpanId,
  minPresentationalSpanDuration,
  minStartTimeNs,
  maxEndTimeNs,
  onClick,
  onMouseEnter,
  onMouseLeave,
  scrollLeft,
  span,
  spanId,
  width,
}: Props) => {
  const { attributes, startTimeNs, endTimeNs } = span;
  const { error, isGhostSpan } = attributes;

  const duration = Math.max(
    endTimeNs - startTimeNs,
    minPresentationalSpanDuration,
  );
  const totalDuration = maxEndTimeNs - minStartTimeNs;

  const name = isGhostSpan ? 'Missing Span' : span.name;
  const spanWidth = (duration / totalDuration) * width;
  const translateX =
    ((startTimeNs - minStartTimeNs) / (maxEndTimeNs - minStartTimeNs)) * width;

  const activeSpanId = hoveredSpanId || clickedSpanId;

  return (
    <div
      className={classnames({
        flamegraph__span: true,
        'flamegraph__span--clicked': clickedSpanId === spanId,
        'flamegraph__span--ghost-span': isGhostSpan,
        'flamegraph__span--greyed-out':
          activeSpanId &&
          !highlightedSpanBitmap[spanId] &&
          activeSpanId !== spanId,
        'flamegraph__span--hovered': hoveredSpanId === spanId,
        'flamegraph__span--highlighted':
          hoveredSpanId && highlightedSpanBitmap[spanId],
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        backgroundColor: getColor(span),
        transform: `translate3d(${translateX}px, 0, 0)`,
        width: `${Math.max(spanWidth, 1)}px`,
      }}
    >
      <div className="flamegraph__span__highlighter" />
      <div className="flamegraph__span__text flex">
        <div className="flex__left">
          <div
            className="flamegraph__span__text__name"
            style={{
              transform: `translate3d(${
                scrollLeft > translateX ? `${scrollLeft - translateX}px` : '0'
              }, 0, 0)`,
            }}
          >
            {error === 'true' ? (
              <div className="flamegraph__span__text__error">
                <BsFillExclamationSquareFill />
              </div>
            ) : null}
            {name}
          </div>
        </div>
        <div>{formatDurationNs(endTimeNs - startTimeNs)}</div>
      </div>
    </div>
  );
};

export default FlamegraphSpan;
