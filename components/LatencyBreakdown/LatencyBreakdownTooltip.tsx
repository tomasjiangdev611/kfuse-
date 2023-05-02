import classnames from 'classnames';
import React from 'react';
import { formatDurationNs } from 'utils';

const LatencyBreakdownTooltip = ({
  activeServiceName,
  serviceLatencyItems,
  spanCount,
  total,
}) => {
  return (
    <div className="latency-breakdown__tooltip">
      <div className="latency-breakdown__tooltip__header">
        {`${spanCount} span${
          spanCount === 1 ? '' : 's'
        } across all services in this trace`}
      </div>
      <table className="latency-breakdown__tooltip__services">
        {serviceLatencyItems.map((serviceLatencyItem) => (
          <tr className="latency-breakdown__tooltip__services__item">
            <td>
              <div className="latency-breakdown__tooltip__services__item__dot__container">
                <div
                  className={classnames({
                    'latency-breakdown__tooltip__services__item__dot': true,
                    'latency-breakdown__tooltip__services__item__dot--active':
                      activeServiceName === serviceLatencyItem.serviceName,
                  })}
                  style={{ backgroundColor: serviceLatencyItem.color }}
                />
              </div>
            </td>
            <td className="latency-breakdown__tooltip__services__item__name">
              {serviceLatencyItem.serviceName}
            </td>
            <td className="latency-breakdown__tooltip__services__item__latency">
              {formatDurationNs(serviceLatencyItem.latency)}
            </td>
            <td className="latency-breakdown__tooltip__services__item__percent">
              {`${Math.round((serviceLatencyItem.latency / total) * 100)}%`}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default LatencyBreakdownTooltip;
