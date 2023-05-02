import React, {
  useState,
  HTMLAttributes,
  useMemo,
  useRef,
  useLayoutEffect,
  ReactElement,
} from 'react';
import { useWindowSize } from 'react-use';

import { calculateTooltipPosition } from '../utils';

export interface VizTooltipContainerProps
  extends HTMLAttributes<HTMLDivElement> {
  position: { x: number; y: number };
  offset: { x: number; y: number };
  children?: React.ReactNode;
  allowPointerEvents?: boolean;
}

const VizTooltipContainer = ({
  position: { x: positionX, y: positionY },
  offset: { x: offsetX, y: offsetY },
  children,
  allowPointerEvents = false,
  ...otherProps
}: VizTooltipContainerProps): ReactElement => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipMeasurement, setTooltipMeasurement] = useState<any>({
    width: 0,
    height: 0,
  });
  const { width, height } = useWindowSize();
  const [placement, setPlacement] = useState({
    x: positionX + offsetX,
    y: positionY + offsetY,
  });

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          const tW = Math.floor(entry.contentRect.width + 2 * 8); //  adding padding until Safari supports borderBoxSize
          const tH = Math.floor(entry.contentRect.height + 2 * 8);
          if (
            tooltipMeasurement.width !== tW ||
            tooltipMeasurement.height !== tH
          ) {
            setTooltipMeasurement({
              width: Math.min(tW, width),
              height: Math.min(tH, height),
            });
          }
        }
      }),
    [tooltipMeasurement, width, height],
  );

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObserver]);

  // Make sure tooltip does not overflow window
  useLayoutEffect(() => {
    if (tooltipRef && tooltipRef.current) {
      const { x, y } = calculateTooltipPosition(
        positionX,
        positionY,
        tooltipMeasurement.width,
        tooltipMeasurement.height,
        offsetX,
        offsetY,
        width,
        height,
      );

      setPlacement({ x, y });
    }
  }, [
    width,
    height,
    positionX,
    offsetX,
    positionY,
    offsetY,
    tooltipMeasurement,
  ]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: 0,
        pointerEvents: allowPointerEvents ? 'auto' : 'none',
        top: 0,
        transform: `translate(${placement.x}px, ${placement.y}px)`,
        transition: 'transform ease-out 0.1s',
      }}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default VizTooltipContainer;
