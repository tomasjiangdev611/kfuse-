import { CursorTooltip } from 'components';
import React from 'react';
import { Span } from 'types';
import TraceSidebarCursorTooltipHoveredSpan from './TraceSidebarCursorTooltipHoveredSpan';

type Props = {
  colorsByServiceName: { [key: string]: string };
  hoveredSpan: Span;
  hoveredSpanId: string;
  totalDurationInNs: number;
};

const TraceSidebarCursorTooltip = ({
  colorsByServiceName,
  hoveredSpan,
  hoveredSpanId,
  totalDurationInNs,
}: Props) => {
  if (hoveredSpan) {
    return (
      <CursorTooltip>
        <TraceSidebarCursorTooltipHoveredSpan
          colorsByServiceName={colorsByServiceName}
          span={hoveredSpan}
          totalDurationInNs={totalDurationInNs}
        />
      </CursorTooltip>
    );
  }

  return (
    <CursorTooltip>
      <div className="trace-sidebar__cursor-tooltip">
        <div className="trace-sidebar__cursor-tooltip__service-name">
          {'Missing Span'}
        </div>
      </div>
    </CursorTooltip>
  );
};

export default TraceSidebarCursorTooltip;
