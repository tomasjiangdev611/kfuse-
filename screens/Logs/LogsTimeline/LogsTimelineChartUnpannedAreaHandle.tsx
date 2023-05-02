import React from 'react';

const HANDLE_HEIGHT = 36;

const LogsTimelineChartUnpannedAreaHandle = ({ position, viewBox }) => {
  return (
    <foreignObject
      style={{ overflow: 'visible' }}
      {...viewBox}
      x={viewBox.x - 2}
      y={viewBox.y + (viewBox.height / 2 - HANDLE_HEIGHT / 2)}
    >
      <div
        className="logs__timeline__chart__unpanned-area__handle"
        xmlns="http://www.w3.org/1999/xhtml"
      />
    </foreignObject>
  );
};

export default LogsTimelineChartUnpannedAreaHandle;
