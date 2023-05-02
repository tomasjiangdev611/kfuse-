import { TooltipTrigger, TooltipPosition } from 'components';
import React, { useState } from 'react';
import { TraceMetrics } from 'types';
import { stringToColor } from 'utils';
import LatencyBreakdownTooltip from './LatencyBreakdownTooltip';

type Props = {
  colorsByServiceName: { [key: string]: string };
  traceMetrics: TraceMetrics;
};

const LatencyBreakdown = ({ colorsByServiceName, traceMetrics }: Props) => {
  const [activeServiceName, setActiveServiceName] = useState(null);
  const setActiveServiceNameHandler = (serviceName: string) => () => {
    setActiveServiceName(serviceName);
  };

  const { spanCount, serviceExecTime } = traceMetrics;

  const total = Object.values(serviceExecTime).reduce(
    (sum: number, value: number) => sum + value,
    0,
  ) as number;

  const serviceLatencyItems = Object.keys(serviceExecTime)
    .sort((a, b) => serviceExecTime[b] - serviceExecTime[a])
    .map((serviceName) => {
      const latency = serviceExecTime[serviceName];
      const percent = latency / total;
      const width = Math.max(Math.round(percent * 150), 4);
      const color =
        colorsByServiceName[serviceName] || stringToColor(serviceName);
      return {
        color,
        latency,
        serviceName,
        width,
      };
    });

  const restOfWidths = serviceLatencyItems
    .slice(1)
    .reduce((sum, serviceLatencyItem) => sum + serviceLatencyItem.width, 0);

  return (
    <TooltipTrigger
      position={TooltipPosition.LEFT}
      tooltip={
        <LatencyBreakdownTooltip
          activeServiceName={activeServiceName}
          serviceLatencyItems={serviceLatencyItems}
          spanCount={spanCount}
          total={total}
        />
      }
    >
      <div className="latency-breakdown">
        {serviceLatencyItems.map((serviceLatencyItem, i) => {
          const width = i === 0 ? 150 - restOfWidths : serviceLatencyItem.width;
          return (
            <div
              className="latency-breakdown__bar"
              key={i}
              onMouseEnter={setActiveServiceNameHandler(
                serviceLatencyItem.serviceName,
              )}
              style={{
                backgroundColor: serviceLatencyItem.color,
                width: `${width}px`,
              }}
            />
          );
        })}
      </div>
    </TooltipTrigger>
  );
};

export default LatencyBreakdown;
