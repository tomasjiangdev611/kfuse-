import {
  Flamegraph,
  Resizer,
  ResizerOrientation,
  TooltipTrigger,
  useLeftSidebarState,
} from 'components';
import { flamegraphPalette } from 'constants';
import { useForm } from 'hooks';
import React, { useMemo, useState } from 'react';
import { Span, TraceMetrics } from 'types';
import TraceSidebarExecTime from './TraceSidebarExecTime';
import { Attribute } from './types';
import { getAttribute } from './utils';

type GetColorMapByAttribute = {
  attribute: Attribute;
  colorsByServiceName: { [key: string]: string };
  spans: Span[];
};

const getColorMapByAttribute = ({
  attribute,
  colorsByServiceName,
  spans,
}: GetColorMapByAttribute): { [key: string]: string } => {
  if (attribute === Attribute.service) {
    return colorsByServiceName;
  }

  const attributeBitMap = spans.reduce((obj, span) => ({
    ...obj,
    [getAttribute(attribute, span)]: 1,
  }));

  return Object.keys(attributeBitMap)
    .sort()
    .reduce(
      (obj, hostname, i) => ({
        ...obj,
        [hostname]: flamegraphPalette[i % flamegraphPalette.length],
      }),
      {},
    );
};

type Props = {
  clickedSpanId?: string;
  colorsByServiceName: { [key: string]: string };
  hoveredSpanId?: string;
  setClickedSpanId: (spanId: string) => void;
  setHoveredSpanId: (spanId: string) => void;
  spans: Span[];
  traceMetrics: TraceMetrics;
};

const TraceSidebarMain = ({
  clickedSpanId,
  colorsByServiceName,
  hoveredSpanId,
  setClickedSpanId,
  setHoveredSpanId,
  spans,
  traceMetrics,
}: Props) => {
  const [width, setWidth] = useState(360);
  const onResize = ({ deltaX }) => {
    setWidth((prevWidth) => Math.max(prevWidth - deltaX, 240));
  };

  const form = useForm({
    attribute: 'service',
    type: 'execTime',
  });

  const colorMap = useMemo(
    () =>
      getColorMapByAttribute({
        attribute: form.values.attribute as Attribute,
        colorsByServiceName,
        spans,
      }),
    [colorsByServiceName, form.values, spans],
  );

  return (
    <div className="trace-sidebar__main">
      <div className="trace-sidebar__main__left">
        <Flamegraph
          clickedSpanId={clickedSpanId}
          getColor={(span: Span) =>
            colorMap[getAttribute(form.values.attribute as Attribute, span)]
          }
          hoveredSpanId={hoveredSpanId}
          setClickedSpanId={setClickedSpanId}
          setHoveredSpanId={setHoveredSpanId}
          spans={spans}
        />
        <Resizer
          onMouseMove={onResize}
          orientation={ResizerOrientation.vertical}
        />
      </div>
      <div
        className="trace-sidebar__main__right"
        style={{ width: `${width}px` }}
      >
        <TraceSidebarExecTime
          colorMap={colorMap}
          form={form}
          spans={spans}
          traceMetrics={traceMetrics}
        />
      </div>
    </div>
  );
};

export default TraceSidebarMain;
