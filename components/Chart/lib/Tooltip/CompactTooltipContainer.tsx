import React, {
  ReactElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TooltipCoordsProps } from '../../types';

const CompactTooltipContainer = ({
  children,
  classname,
  coords,
}: {
  children: ReactElement;
  classname?: string;
  coords: TooltipCoordsProps;
}): ReactElement => {
  const { x, y, position: coordsPos } = coords;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipMeasurement, setTooltipMeasurement] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

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
            setTooltipMeasurement({ width: tW, height: tH });
          }
        }
      }),
    [],
  );

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObserver]);

  if (!children) {
    return null;
  }

  const offsetLeft = coordsPos === 'left' ? tooltipMeasurement.width : 0;
  return (
    <div
      className={classname}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${x - offsetLeft}px, ${y}px)`,
        zIndex: 9999,
      }}
      ref={tooltipRef}
    >
      {children}
    </div>
  );
};

export default CompactTooltipContainer;
