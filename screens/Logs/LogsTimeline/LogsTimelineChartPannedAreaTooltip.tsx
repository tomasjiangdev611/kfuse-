import { useRefAreaState } from 'hooks';
import React from 'react';
import { X } from 'react-feather';
import { getUnit, formatNs, xAxisTickFormatter } from 'utils';

type Props = {
  labels: number[];
  onClearCallback: () => void;
  refAreaState: ReturnType<typeof useRefAreaState>;
  viewBox: { x: number; y: number; height: number; width: number };
  utcTimeEnabled: boolean;
};

const LogsTimelineChartPannedAreaTooltip = ({
  refAreaState,
  labels,
  onClearCallback,
  utcTimeEnabled,
  viewBox,
}: Props) => {
  const { clear, state } = refAreaState;
  const { refAreaLeft, refAreaRight } = state;
  const startIndex = Math.max(refAreaLeft, 0);
  const endIndex = Math.min(refAreaRight, labels.length - 1);

  const startLabel = labels[startIndex];
  const endLabel = labels[endIndex];
  const diffInSeconds = endLabel - startLabel;
  const diffInNs = diffInSeconds * 1000000000;
  const unit = getUnit(diffInNs);
  const tickFormatter = xAxisTickFormatter(labels, utcTimeEnabled);
  const formatted = `${tickFormatter(startIndex)} - ${tickFormatter(
    endIndex,
  )} (${formatNs(diffInNs, unit)}${unit})`;

  const onClick = () => {
    onClearCallback();
    clear();
  };

  return (
    <foreignObject
      style={{ overflow: 'visible' }}
      {...viewBox}
      width={isNaN(viewBox.width) ? 200 : viewBox.width}
      x={isNaN(viewBox.x) ? 0 : viewBox.x}
      y={viewBox.height + viewBox.y}
    >
      <div
        className="logs__timeline__chart__panned-area__tooltip"
        xmlns="http://www.w3.org/1999/xhtml"
      >
        <div className="logs__timeline__chart__panned-area__tooltip__inner">
          <div className="logs__timeline__chart__panned-area__tooltip__formatted">
            {formatted}
          </div>
          <div
            className="logs__timeline__chart__panned-area__tooltip__close"
            onClick={onClick}
          >
            <X size={11} />
          </div>
        </div>
      </div>
    </foreignObject>
  );
};

export default LogsTimelineChartPannedAreaTooltip;
