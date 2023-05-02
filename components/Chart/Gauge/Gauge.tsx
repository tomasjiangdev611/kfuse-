import React, { ReactElement, useRef } from 'react';

import GaugeGraph from './GaugeGraph';
import { getGaugeGrid } from './utils';

const Gauge = ({
  chartWidth,
  chartHeight,
  gaugeData,
}: {
  chartWidth: number;
  chartHeight: number;
  gaugeData: Array<{
    label: string;
    max: number;
    stat: { prefix: string; value: number; suffix: string; textColor: string };
  }>;
}): ReactElement => {
  const gaugeRef = useRef(null);

  const { rows, cols } = getGaugeGrid(gaugeData?.length);
  return (
    <div className="gauge" ref={gaugeRef}>
      {gaugeData.map((gauge, idx: number) => {
        return (
          <GaugeGraph
            key={idx}
            height={chartHeight / rows}
            label={gauge.label}
            max={gauge.max}
            threshold={80}
            stat={gauge.stat}
            width={chartWidth / cols}
          />
        );
      })}
    </div>
  );
};

export default Gauge;
