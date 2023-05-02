import classnames from 'classnames';
import { ChipWithLabel, HighlightedText } from 'components';
import React from 'react';
import { Handle, NodeToolbar, Position } from 'reactflow';
import { circleDiameter, labelWidth } from './constants';
import { useServiceMapStateContext } from './ServiceMapStateContext';
import { Orientation } from './types';

const verticalHandleStyle = { left: 18 };
const horizontalSourceHandleStyle = {
  top: `${circleDiameter / 2}px`,
  left: `${labelWidth - (labelWidth - circleDiameter) / 2}px`,
};
const horizontalTargetHandleStyle = {
  top: `${circleDiameter / 2}px`,
  left: `${(labelWidth - circleDiameter) / 2}px`,
};

const ServiceMapNode = ({ data, id }) => {
  const { color, hasError, label, outerRingSize } = data;
  const {
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    renderNodeTooltip,
    state,
  } = useServiceMapStateContext();

  const { hoveredNodeId, orientation, outerRingKey, search, selectedNodeId } =
    state;
  const isHorizontal = orientation === Orientation.horizontal;

  const isHovered = hoveredNodeId === id;
  const isSelected = selectedNodeId === id;

  const onMouseEnter = () => {
    onNodeMouseEnter(id);
  };

  const onClick = () => {
    onNodeClick(id);
  };

  return (
    <>
      <Handle
        position={isHorizontal ? Position.Left : Position.Top}
        style={isHorizontal ? horizontalTargetHandleStyle : verticalHandleStyle}
        type="target"
      />
      <Handle
        position={isHorizontal ? Position.Right : Position.Bottom}
        style={isHorizontal ? horizontalSourceHandleStyle : verticalHandleStyle}
        type="source"
      />
      {isHovered && renderNodeTooltip ? (
        <NodeToolbar isVisible position={Position.Top}>
          {renderNodeTooltip(id, data)}
        </NodeToolbar>
      ) : null}
      <div
        className={classnames({
          'service-map__node': 1,
          'service-map__node--horizontal': isHorizontal,
        })}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onNodeMouseLeave}
      >
        <div className="service-map__node__circle">
          <div
            className={classnames({
              'service-map__node__circle__inner-ring': true,
              'service-map__node__circle__inner-ring--error': hasError,
            })}
          >
            {isSelected ? (
              <div className="service-map__node__circle__selected" />
            ) : null}
          </div>
          {outerRingKey && outerRingSize ? (
            <div
              className="service-map__node__circle__outer-ring"
              style={{
                outlineWidth: `${outerRingSize * 2}px`,
              }}
            />
          ) : null}
        </div>
        <div className="service-map__node__label">
          <ChipWithLabel
            color={color}
            label={<HighlightedText highlighted={search} text={label} />}
          />
        </div>
      </div>
    </>
  );
};

export default ServiceMapNode;
