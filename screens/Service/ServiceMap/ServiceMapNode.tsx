import { ChipWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import { useRequest, useToggle, useUrlSearchParams } from 'hooks';
import React from 'react';
import { queryRange } from 'requests';
import { DateSelection } from 'types';
import { pickUrlSearchParamsByKeys } from 'utils';
import ServiceMapNodeTooltip from './ServiceMapNodeTooltip';
import { getTimeParameter } from './utils';
import { SidebarState } from '../types';

const queryValue = (date: DateSelection, query: string) =>
  queryRange({ date, instant: true, query }).then((result) =>
    result.length && result[0].value.length > 1
      ? Number(result[0].value[1])
      : 0,
  );

const queryValues = async ({ date, serviceName, spanName }) => {
  const values = await Promise.all([
    queryValue(date, errorsQuery(date, serviceName, spanName)),
    queryValue(date, latencyQuery(date, serviceName, spanName)),
    queryValue(date, requestsQuery(date, serviceName, spanName)),
  ]);

  return {
    errors: values[0],
    latency: values[1],
    requests: values[2],
  };
};

type Props = {
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  nodeDatum: {
    attributes: {
      service_name: string;
      span_name: string;
      span_type: string;
    };
  };
  setSidebar: (sidebar: SidebarState) => void;
};

const ServiceMapNode = ({
  colorsByServiceName,
  date,
  nodeDatum,
  setSidebar,
}: Props) => {
  const urlSearchParams = useUrlSearchParams();
  const showTooltipToggle = useToggle(false);
  const valuesRequest = useRequest(queryValues);
  const {
    service_name: serviceName,
    span_name: spanName,
    span_type: spanType,
  } = nodeDatum.attributes;

  const onMouseEnter = () => {
    if (!valuesRequest.calledAtLeastOnce) {
      valuesRequest.call({ date, serviceName, spanName });
    }

    showTooltipToggle.on();
  };

  const onSpanNameClick = () => {
    setSidebar((prevSidebar) => {
      return {
        ...prevSidebar,
        activeName: spanName,
      };
    });
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
                    <button
                      className="service-map__node__label__span-link link"
                      onClick={onSpanNameClick}
                    >
                      {spanName}
                    </button>
                  </div>
                }
              />
            </div>
          </div>
          {showTooltipToggle.value ? (
            <ServiceMapNodeTooltip
              isLoading={valuesRequest.isLoading}
              spanName={spanName}
              values={valuesRequest.result || {}}
            />
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
};

export default ServiceMapNode;
