import { useLayoutEffect, useRef, useState } from 'react';
import { useMountedState } from 'react-use';

import { getBarSeriesIdx, tooltipCursorViewport } from 'components/Chart/utils';
import {
  ChartRenderProps,
  ChartType,
  TooltipCoordsProps,
  UPlotConfig,
} from 'components/Chart/types';

const TOOLTIP_COORDS_CACHE = new Map<string, TooltipCoordsProps>();

const useTooltipPlugin = (
  chartType: ChartType,
  config: UPlotConfig,
  layoutType: ChartRenderProps['layoutType'],
): {
  coords: TooltipCoordsProps | null;
  isActive: boolean;
  focusedSeriesIdx: number | null;
  focusedPointIdx: number | null;
} => {
  const plotInstance = useRef<uPlot>();
  const [focusedSeriesIdx, setFocusedSeriesIdx] = useState<number | null>(null);
  const [focusedPointIdx, setFocusedPointIdx] = useState<number | null>(null);

  const [coords, setCoords] = useState<TooltipCoordsProps | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const isMounted = useMountedState();

  useLayoutEffect(() => {
    let bbox: DOMRect | undefined = undefined;
    TOOLTIP_COORDS_CACHE.clear();

    const plotEnter = () => {
      if (!isMounted()) {
        return;
      }
      setIsActive(true);
      plotInstance.current?.root.classList.add('plot-active');
    };

    const plotLeave = () => {
      if (!isMounted()) {
        return;
      }
      setCoords(null);
      setIsActive(false);
      plotInstance.current?.root.classList.remove('plot-active');
    };

    // cache uPlot plotting area bounding box
    config.addHook('syncRect', (u: uPlot, rect: DOMRect) => (bbox = rect));

    config.addHook('init', (u: uPlot) => {
      plotInstance.current = u;

      u.root.parentElement?.addEventListener('focus', plotEnter);
      u.over.addEventListener('mouseenter', plotEnter);

      u.root.parentElement?.addEventListener('blur', plotLeave);
      u.over.addEventListener('mouseleave', plotLeave);
    });

    config.addHook('setLegend', (u: uPlot) => {
      if (!isMounted()) {
        return;
      }
      setFocusedPointIdx(u.legend.idx!);
    });

    // default series/datapoint idx retireval
    config.addHook('setCursor', (u: uPlot) => {
      if (!bbox || !isMounted()) {
        return;
      }

      if (chartType === 'Bar' || chartType === 'Stacked Bar') {
        const seriesIdx = getBarSeriesIdx(u);
        if (seriesIdx !== null) {
          setFocusedSeriesIdx(seriesIdx);
          const pointIdx = u.posToIdx(u.cursor.left);
          if (pointIdx !== focusedPointIdx) {
            setFocusedPointIdx(pointIdx);
          }
          u.setSeries(seriesIdx, { focus: true });
        }
      }

      const key = `${u.cursor.left}-${u.cursor.top}`;
      if (TOOLTIP_COORDS_CACHE.has(key)) {
        setCoords(TOOLTIP_COORDS_CACHE.get(key));
        return;
      }

      const { x, y, position } = tooltipCursorViewport(
        bbox,
        config.axes[1],
        u.cursor,
        layoutType,
      );

      if (x !== undefined && y !== undefined) {
        setCoords({ x, y, position });
        TOOLTIP_COORDS_CACHE.set(key, { x, y, position });
      } else {
        setCoords(null);
      }
    });

    config.addHook('setSeries', (_: any, idx: number) => {
      if (!isMounted()) {
        return;
      }
      setFocusedSeriesIdx(idx);
    });

    return () => {
      setCoords(null);
      if (plotInstance.current) {
        plotInstance.current.over.removeEventListener('mouseleave', plotLeave);
        plotInstance.current.over.removeEventListener('mouseenter', plotEnter);
        plotInstance.current.root.parentElement?.removeEventListener(
          'focus',
          plotEnter,
        );
        plotInstance.current.root.parentElement?.removeEventListener(
          'blur',
          plotLeave,
        );
      }
    };
  }, [config, setCoords, setIsActive, setFocusedPointIdx]);

  return {
    coords,
    focusedPointIdx,
    focusedSeriesIdx,
    isActive,
  };
};

export default useTooltipPlugin;
