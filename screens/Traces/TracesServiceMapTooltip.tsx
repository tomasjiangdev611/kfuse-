import React from 'react';
import { formatDurationNs } from 'utils';

type Values = { [key: string]: number };

const valueitems = [
  {
    label: 'Requests',
    render: (values: Values) => `${values.requests?.toFixed(2) || 0}/s`,
  },
  {
    label: 'Max Latency',
    render: (values: Values) =>
      formatDurationNs((values.latency || 0) * 1000000, 1, 1),
  },
  { label: 'Errors', render: (values: Values) => values.errors?.toFixed(2) },
];

const TracesServiceMapTooltip = ({ isLoading, serviceName, values }) => {
  return (
    <div className="traces__service-map__node__tooltip">
      <div className="traces__service-map__node__tooltip__name">
        {serviceName}
      </div>
      <div className="traces__service-map__node__tooltip__values">
        {valueitems.map((valueItem, i) => (
          <div
            className="traces__service-map__node__tooltip__values__item"
            key={i}
          >
            <div className="traces__service-map__node__tooltip__values__item__label">
              {valueItem.label}
            </div>
            <div className="traces__service-map__node__tooltip__values__item__value">
              {isLoading ? '-' : valueItem.render(values)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracesServiceMapTooltip;
