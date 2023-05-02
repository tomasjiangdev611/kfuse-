import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react';
import { useMountedState } from 'react-use';
import uPlot, { AlignedData } from 'uplot';

import { SeriesTable } from '../components';
import VizTooltipContainer from '../VizTooltipContainer';
import {
  getCursorTimestamp,
  getCursorValue,
  getLabelColor,
  getLabelFromSeries,
  positionTooltip,
  tooltipFormatter,
} from '../../utils';
import { UPlotConfig } from '../../types';

const TooltipPlugin = ({
  config,
  data,
  unit,
}: {
  config: UPlotConfig;
  data: AlignedData;
  unit?: string;
}): ReactElement => {
  const plotInstance = useRef<uPlot>();
  const [focusedSeriesIdx, setFocusedSeriesIdx] = useState<number | null>(null);
  const [focusedPointIdx, setFocusedPointIdx] = useState<number | null>(null);
  const [focusedPointIdxs, setFocusedPointIdxs] = useState<
    Array<number | null>
  >([]);
  const [coords, setCoords] = useState<any | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const isMounted = useMountedState();

  const TOOLTIP_OFFSET = 10;

  useLayoutEffect(() => {
    let bbox: DOMRect | undefined = undefined;

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
      setFocusedPointIdxs(u.legend.idxs!.slice());
    });

    // default series/datapoint idx retireval
    config.addHook('setCursor', (u: uPlot) => {
      if (!bbox || !isMounted()) {
        return;
      }

      const { x, y } = positionTooltip(u, bbox);
      if (x !== undefined && y !== undefined) {
        setCoords({ x, y });
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
  }, [config, setCoords, setIsActive, setFocusedPointIdx, setFocusedPointIdxs]);

  const renderTooltip = () => {
    if (!isActive || !focusedSeriesIdx || !focusedPointIdx) {
      return null;
    }

    const value = getCursorValue(data, focusedSeriesIdx, focusedPointIdx);
    return (
      <VizTooltipContainer
        position={{ x: coords.x, y: coords.y }}
        offset={{ x: TOOLTIP_OFFSET, y: TOOLTIP_OFFSET }}
      >
        <SeriesTable
          series={[
            {
              label: getLabelFromSeries(config.series, focusedSeriesIdx),
              value: tooltipFormatter(value, unit),
              color: getLabelColor(config.series, focusedSeriesIdx),
            },
          ]}
          timestamp={getCursorTimestamp(data, focusedPointIdx)}
        />
      </VizTooltipContainer>
    );
  };

  return <>{coords && renderTooltip()}</>;
};

export default TooltipPlugin;
