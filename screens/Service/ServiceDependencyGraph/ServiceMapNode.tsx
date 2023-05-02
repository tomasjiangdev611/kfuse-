import { ChipWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import { useRequest, useToggle, useUrlSearchParams } from 'hooks';
import React from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { pickUrlSearchParamsByKeys } from 'utils';
import ServiceMapNodeTooltip from './ServiceMapNodeTooltip';
import { getTimeParameter } from './utils';

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  nodeDatum: any;
};

const ServiceMapNode = ({ colorsByServiceName, date, nodeDatum }: Props) => {
  const urlSearchParams = useUrlSearchParams();
  const showTooltipToggle = useToggle(false);
  const valuesRequest = useRequest(queryValues);
  const { service_name: serviceName, span_type: spanType } =
    nodeDatum.attributes;

  const onMouseEnter = () => {
    if (!valuesRequest.calledAtLeastOnce) {
      valuesRequest.call({ date, serviceName });
    }

    showTooltipToggle.on();
  };

  return (
    <g height={100} width={200}>
      <foreignObject
        height={36}
        width={36}
        x={-17}
        y={-17}
        style={{ overflow: 'visible' }}
      >
        <div
          className="service-map__node"
          onMouseEnter={onMouseEnter}
          onMouseLeave={showTooltipToggle.off}
        >
          <div className="service-map__node__circle">
            <div className="service-map__node__circle__inner">
              <div className="service-map__node__circle__inner__icon">
                {iconsBySpanType[spanType]}
              </div>
            </div>
          </div>
          <div className="service-map__node__label">
            <div>
              <ChipWithLabel
                color={colorsByServiceName[serviceName]}
                label={
                  <div>
                    <a
                      className="service-map__node__label__service-link link text--weight-medium"
                      href={`#/apm/services/${serviceName}${pickUrlSearchParamsByKeys(
                        urlSearchParams,
                        ['date'],
                      )}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {serviceName}
                    </a>
                  </div>
                }
              />
            </div>
          </div>
          {showTooltipToggle.value ? (
            <ServiceMapNodeTooltip
              isLoading={valuesRequest.isLoading}
              serviceName={serviceName}
              values={valuesRequest.result || {}}
            />
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
};

export default ServiceMapNode;
