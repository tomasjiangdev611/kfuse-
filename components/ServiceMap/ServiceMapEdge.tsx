import React from 'react';
import {
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from 'reactflow';
import { useServiceMapStateContext } from './ServiceMapStateContext';
import { EdgeType } from './types';

const getPathFunction = (edgeType: EdgeType) => {
  switch (edgeType) {
    case EdgeType.bezier:
      return getBezierPath;
    case EdgeType.simplebezier:
      return getSimpleBezierPath;
    case EdgeType.step:
    case EdgeType.smoothstep:
      return getSmoothStepPath;
    case EdgeType.straight:
      return getStraightPath;
    default:
      return getSmoothStepPath;
  }
};

const ServiceMapEdge = ({
  id,
  markerEnd,
  sourceX,
  sourceY,
  style,
  targetX,
  targetY,
  ...rest
}: EdgeProps) => {
  const { onEdgeMouseEnter, onEdgeMouseLeave, state } =
    useServiceMapStateContext();
  const { edgeType, hoveredEdgeId } = state;

  const pathFunction = getPathFunction(edgeType);

  const [edgePath, labelX, labelY] = pathFunction({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onEdgeMouseEnterHandler = () => {
    onEdgeMouseEnter(id);
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path service-map__edge__path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <path
        id={id}
        className="react-flow__edge-path service-map__edge__path-hoverable"
        d={edgePath}
        onMouseEnter={onEdgeMouseEnterHandler}
        onMouseLeave={onEdgeMouseLeave}
        style={style}
      />
      {hoveredEdgeId === id ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan service-map__edge__label"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          />
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
};

export default ServiceMapEdge;
