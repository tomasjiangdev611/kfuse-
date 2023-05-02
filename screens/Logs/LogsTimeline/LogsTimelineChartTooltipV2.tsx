import React, { useEffect } from 'react';

type Props = {
  active?: boolean;
  label?: number;
  setHoveredIndex: (hoveredIndex: number) => void;
};

const LogsTimelineChartTooltipV2 = ({
  active,
  label,
  setHoveredIndex,
}: Props) => {
  useEffect(() => {
    setHoveredIndex(label);
  }, [label]);

  useEffect(() => {
    if (!active) {
      setHoveredIndex(null);
    }
  }, [active]);

  return <div />;
};

export default LogsTimelineChartTooltipV2;
