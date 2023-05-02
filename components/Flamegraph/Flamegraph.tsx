import React from 'react';
import { Span } from 'types';
import FlamegraphMain from './FlamegraphMain';
import SizeObserver from '../SizeObserver';

type Props = {
  clickedSpanId?: string;
  getColor: (span: Span) => string;
  hoveredSpanId?: string;
  setClickedSpanId: (spanId: string) => void;
  setHoveredSpanId: (spanId: string) => void;
  spans: Span[];
};

const Flamegraph = ({
  clickedSpanId,
  getColor,
  hoveredSpanId,
  setClickedSpanId,
  setHoveredSpanId,
  spans,
}: Props) => {
  return (
    <SizeObserver className="flamegraph">
      {({ width: baseWidth }) => (
        <FlamegraphMain
          baseWidth={baseWidth}
          clickedSpanId={clickedSpanId}
          getColor={getColor}
          hoveredSpanId={hoveredSpanId}
          setClickedSpanId={setClickedSpanId}
          setHoveredSpanId={setHoveredSpanId}
          spans={spans}
        />
      )}
    </SizeObserver>
  );
};

export default Flamegraph;
