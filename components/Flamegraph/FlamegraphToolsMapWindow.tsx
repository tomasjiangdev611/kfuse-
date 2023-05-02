import { useMouseMover, useToggle } from 'hooks';
import React, { MutableRefObject } from 'react';
import { MAP_WIDTH } from './constants';

type Props = {
  baseWidth: number;
  elementRef: MutableRefObject<HTMLDivElement>;
  scrollLeft: number;
  width: number;
};

const FlamegraphToolsMapWindow = ({
  baseWidth,
  elementRef,
  scrollLeft,
  width,
}: Props) => {
  const translateX = (scrollLeft * MAP_WIDTH) / width;
  const isDraggingToggle = useToggle();
  const ratio = baseWidth / width;

  const onMouseMove = ({ deltaX }) => {
    const element = elementRef.current;
    if (element && deltaX) {
      const prevScrollLeft = element.scrollLeft;

      const deltaScrollX = (deltaX * width) / MAP_WIDTH;
      const nextScrollLeft = Math.max(
        Math.min(prevScrollLeft + deltaScrollX, element.scrollWidth),
        0,
      );

      element.scrollLeft = nextScrollLeft;
    }
  };

  const mouseMover = useMouseMover({
    onMouseDown: isDraggingToggle.on,
    onMouseMove,
    onMouseUp: isDraggingToggle.off,
  });

  if (ratio < 1) {
    return (
      <div
        className="flamegraph__tools__map__window"
        onMouseDown={mouseMover.onMouseDown}
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          width: `${ratio * MAP_WIDTH}px`,
        }}
      />
    );
  }

  return null;
};

export default FlamegraphToolsMapWindow;
