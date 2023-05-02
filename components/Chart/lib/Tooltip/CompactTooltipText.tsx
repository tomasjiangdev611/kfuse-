import { dateTimeFormat } from 'constants/dateTimeFormat';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

const CompactTooltipText = ({
  color,
  label,
  position,
  value,
  timestamp,
}: {
  color: string;
  label: string;
  position: string;
  value: string;
  timestamp: number;
}): ReactElement => {
  return (
    <div
      className="uplot__compact-tooltip"
      style={{
        alignItems: position === 'left' ? 'flex-end' : 'flex-start',
      }}
    >
      <div className="uplot__compact-tooltip__value">
        {dayjs.unix(timestamp).format(dateTimeFormat)}
      </div>
      <div
        className="uplot__compact-tooltip__item"
        style={{ backgroundColor: color }}
      >
        <div>{label}</div>
      </div>
      <div className="uplot__compact-tooltip__value">{value}</div>
    </div>
  );
};

export default CompactTooltipText;
