import React, {
  MutableRefObject,
  ReactNode,
  useLayoutEffect,
  useRef,
} from 'react';
import { Zoom } from './types';

type Props = {
  baseWidth: number;
  children: ReactNode;
  elementRef: MutableRefObject<HTMLDivElement>;
  onScroll: VoidFunction;
  zoom: Zoom;
};

const FlamegraphInner = ({
  baseWidth,
  children,
  elementRef,
  onScroll,
  zoom,
}: Props) => {
  const prevScaleRef = useRef(zoom.scale);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element) {
      const prevScale = prevScaleRef.current;
      const prevScrollLeft = element.scrollLeft;

      const nextScale = zoom.scale;

      const midpoint = prevScrollLeft + baseWidth / 2;
      const nextMidpoint = (midpoint * nextScale) / prevScale;

      const nextScrollLeft = nextMidpoint - baseWidth / 2;

      element.scrollLeft = nextScrollLeft;
      prevScaleRef.current = nextScale;
    }
  }, [zoom]);

  return (
    <div className="flamegraph__inner" onScroll={onScroll} ref={elementRef}>
      {children}
    </div>
  );
};

export default FlamegraphInner;
