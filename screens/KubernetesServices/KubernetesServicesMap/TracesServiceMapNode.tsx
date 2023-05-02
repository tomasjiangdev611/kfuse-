import classnames from 'classnames';
import { ChipWithLabel } from 'components';
import { iconsBySpanType } from 'constants';
import React from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { DateSelection, SelectedFacetValuesByName } from 'types';
import { Group } from '@visx/group';
import TracesServiceMapNodeTooltip from './TracesServiceMapNodeTooltip';
import { ServiceMapType } from './types';

const getWidthAndHeight = ({
  activeServiceMapType,
  requestsByServiceName,
  serviceName,
}) => {
  switch (activeServiceMapType) {
    case ServiceMapType.cluster: {
      const size = requestsByServiceName[serviceName] || 40;
      return {
        height: Math.max(size, 20),
        width: Math.max(size, 20),
      };
    }
    case ServiceMapType.flow:
      return { height: 20, width: 220 };
    case ServiceMapType.mini:
      return { height: 40, width: 40 };
  }
};

const renderShape = ({
  activeServiceMapType,
  colorsByServiceName,
  onMouseEnter,
  onMouseLeave,
  serviceName,
  spanTypeByServiceName,
}) => {
  switch (activeServiceMapType) {
    case ServiceMapType.cluster:
      return (
        <>
          <div className="traces__service-map__node__circle">
            <div
              className="traces__service-map__node__circle__inner"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              style={{ borderColor: colorsByServiceName[serviceName] }}
            >
              <div className="traces__service-map__node__circle__inner__icon" />
            </div>
          </div>
          <div className="traces__service-map__node__label">
            <div>
              <div className="text--weight-medium">{serviceName}</div>
            </div>
          </div>
        </>
      );
    case ServiceMapType.flow:
      return (
        <div className="traces__service-map__node__rectangle">
          <div
            className="traces__service-map__node__rectangle__inner"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <ChipWithLabel
              color={colorsByServiceName[serviceName]}
              label={
                <div>
                  <div className="text--weight-medium">{serviceName}</div>
                </div>
              }
            />
          </div>
        </div>
      );
    case ServiceMapType.mini:
      return (
        <div className="traces__service-map__node__rectangle">
          <div
            className="traces__service-map__node__rectangle__inner"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <ChipWithLabel
              color={colorsByServiceName[serviceName]}
              label={
                <div className="traces__service-map__node__rectangle__icon">
                  {serviceName &&
                  spanTypeByServiceName[serviceName] &&
                  iconsBySpanType[spanTypeByServiceName[serviceName]] ? (
                    iconsBySpanType[spanTypeByServiceName[serviceName]]
                  ) : (
                    <AiOutlineSetting size={14} />
                  )}
                </div>
              }
            />
          </div>
        </div>
      );
  }
};

type Props = {
  activeServiceMapType: ServiceMapType;
  colorsByServiceName: { [key: string]: string };
  date: DateSelection;
  index: number;
  isHovered?: boolean;
  nodeDatum: { x: number; y: number; data: { id: string } };
  requestsByServiceName: { [key: string]: number };
  selectedFacetValuesByName: SelectedFacetValuesByName;
  setHoveredNodeIndex: (index: number) => void;
  spanTypeByServiceName: { [key: string]: string };
};

const TracesServiceMapNode = ({
  activeServiceMapType,
  colorsByServiceName,
  date,
  index,
  isHovered,
  nodeDatum,
  requestsByServiceName,
  selectedFacetValuesByName,
  setHoveredNodeIndex,
  spanTypeByServiceName,
}: Props) => {
  const serviceName = nodeDatum.data.id;

  const onMouseEnter = () => {
    setHoveredNodeIndex(index);
  };

  const onMouseLeave = () => {
    setHoveredNodeIndex(null);
  };

  const { height, width } = getWidthAndHeight({
    activeServiceMapType,
    requestsByServiceName,
    serviceName,
  });

  return (
    <Group
      className={classnames({
        'traces__service-map__node': true,
        'traces__service-map__node--hovered': isHovered,
      })}
      height={height}
      width={width}
      left={nodeDatum.x}
      top={nodeDatum.y}
    >
      <foreignObject
        height={height}
        width={width}
        x={ServiceMapType.mini ? -10 : -17}
        y={ServiceMapType.mini ? -10 : -17}
        style={{ overflow: 'visible' }}
      >
        <div className="traces__service-map__node__inner">
          {renderShape({
            activeServiceMapType,
            colorsByServiceName,
            onMouseEnter,
            onMouseLeave,
            serviceName,
            spanTypeByServiceName,
          })}
          {isHovered ? (
            <TracesServiceMapNodeTooltip
              date={date}
              serviceName={serviceName}
              selectedFacetValuesByName={selectedFacetValuesByName}
            />
          ) : null}
        </div>
      </foreignObject>
    </Group>
  );
};

export default TracesServiceMapNode;
