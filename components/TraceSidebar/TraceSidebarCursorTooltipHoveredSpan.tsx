import { ChipWithLabel, IconWithLabel } from 'components';
import React from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsFillExclamationSquareFill } from 'react-icons/bs';
import { Span } from 'types';
import { formatDurationNs } from 'utils';

type Props = {
  colorsByServiceName: { [key: string]: string };
  span: Span;
  totalDurationInNs: number;
};

const TraceSidebarCursorTooltip = ({
  colorsByServiceName,
  span,
  totalDurationInNs,
}: Props) => {
  const { attributes, endTimeNs, startTimeNs } = span;
  const durationInNs = endTimeNs - startTimeNs;
  const isError = attributes.error === 'true';

  return (
    <div className="trace-sidebar__cursor-tooltip">
      <div className="trace-sidebar__cursor-tooltip__service-name">
        <ChipWithLabel
          color={colorsByServiceName[span.serviceName]}
          label={span.serviceName}
        />
      </div>
      <div className="trace-sidebar__cursor-tooltip__name">{`${
        span.statusCode ? `${span.statusCode} ` : ''
      }${span.method ? `${span.method} ` : ''}${span.name}`}</div>
      <div className="trace-sidebar__cursor-tooltip__time">
        <AiOutlineClockCircle size={14} />
        <div className="trace-sidebar__cursor-tooltip__time__duration">
          {formatDurationNs(durationInNs, 1, 1)}
        </div>
        <div className="trace-sidebar__cursor-tooltip__time__percent">
          {!isNaN(durationInNs) && totalDurationInNs
            ? `(${Math.round(
                (durationInNs / totalDurationInNs) * 100,
              )}% of total time)`
            : ''}
        </div>
      </div>
      {isError ? (
        <div className="trace-sidebar__cursor-tooltip__error">
          <IconWithLabel
            icon={<BsFillExclamationSquareFill color="#da545b" />}
            label="Error"
          />
        </div>
      ) : null}
    </div>
  );
};

export default TraceSidebarCursorTooltip;
