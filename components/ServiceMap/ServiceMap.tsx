import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  EdgeTypes,
  MiniMap,
  NodeTypes,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import getFlowLayout from './getFlowLayout';
import getLayoutWithState from './getLayoutWithState';
import ServiceMapEdge from './ServiceMapEdge';
import ServiceMapMiniMapNode from './ServiceMapMiniMapNode';
import ServiceMapNode from './ServiceMapNode';
import ServiceMapToolbar from './ServiceMapToolbar';
import { ServiceMapStateContextProvider } from './ServiceMapStateContext';
import { ServiceMapType } from './types';
import useServiceMapState from './useServiceMapState';
import CursorTooltip from '../CursorTooltip';
import ShiftToZoomHelperText from '../ShiftToZoomHelperText';
import SizeObserver from '../SizeObserver';

const defaultEdgeOptions = {};

const nodeTypes: NodeTypes = {
  custom: ServiceMapNode,
};

const edgeTypes: EdgeTypes = {
  custom: ServiceMapEdge,
};

const proOptions = {
  account: 'paid-pro',
  hideAttribution: true,
};

const ServiceMap = ({
  customFilters = [],
  initialEdges,
  initialNodes,
  orientation,
  renderEdgeTooltip,
  renderNodeTooltip,
}) => {
  const serviceMapState = useServiceMapState({
    orientation,
    renderNodeTooltip,
  });
  const { hoveredEdgeId, showMiniMap } = serviceMapState.state;

  const reactFlow = useReactFlow();

  const [activeServiceMapType] = useState(ServiceMapType.flow);

  const { edges: flowEdges, nodes: flowNodes } = useMemo(
    () =>
      getFlowLayout({
        customFilters,
        edges: initialEdges,
        nodes: initialNodes,
        serviceMapState,
      }),
    [customFilters, initialEdges, initialNodes, serviceMapState.state],
  );

  const resetZoom = () => {
    reactFlow.fitView({ duration: 400 });
  };

  useEffect(() => {
    serviceMapState.clear();
    setTimeout(resetZoom, 500);
  }, [initialEdges, initialNodes]);

  const { edges, nodes } = useMemo(
    () =>
      getLayoutWithState({
        edges: flowEdges,
        nodes: flowNodes,
        serviceMapState,
      }),
    [activeServiceMapType, flowEdges, flowNodes, serviceMapState.state],
  );

  const hoveredEdge = edges.find((edge) => edge.id === hoveredEdgeId);
  const isShowingAllNodes = initialNodes.length === nodes.length;

  const clearHandler = () => {
    serviceMapState.clear();
    setTimeout(resetZoom, 500);
  };

  return (
    <ServiceMapStateContextProvider serviceMapState={serviceMapState}>
      <div className="service-map">
        <ServiceMapToolbar
          customFilters={customFilters}
          initialNodes={initialNodes}
          reactFlow={reactFlow}
          resetZoom={resetZoom}
          serviceMapState={serviceMapState}
        />
        <SizeObserver className="service-map__body">
          {({ height, width }) => (
            <div
              className="service-map__inner"
              style={{ height: `${height}px`, width: `${width}px` }}
            >
              <ReactFlow
                defaultEdgeOptions={defaultEdgeOptions}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 42 }}
                // newly added edges get these options automatically
                minZoom={-Infinity}
                maxZoom={Infinity}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                nodes={nodes}
                proOptions={proOptions}
                zoomActivationKeyCode="Shift"
                zoomOnScroll={false}
              >
                {showMiniMap ? (
                  <MiniMap
                    nodeColor={(node) => node.data.color || '#3d8bc9'}
                    nodeStrokeWidth={6}
                    nodeComponent={ServiceMapMiniMapNode}
                    zoomable
                    pannable
                  />
                ) : null}
              </ReactFlow>
              <div className="service-map__helper-text">
                <ShiftToZoomHelperText />
              </div>
              <div className="service-map__node-count">
                <div className="service-map__node-count__left">
                  {`Showing ${
                    isShowingAllNodes
                      ? `all ${initialNodes.length}`
                      : `${nodes.length} of ${initialNodes.length}`
                  } nodes`}
                </div>
                {!isShowingAllNodes ? (
                  <div className="service-map__node-count__right">
                    <span
                      className="service-map__node-count__link link"
                      onClick={clearHandler}
                    >
                      Reset Filters
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </SizeObserver>
        {hoveredEdge && renderEdgeTooltip ? (
          <CursorTooltip>{renderEdgeTooltip(hoveredEdge)}</CursorTooltip>
        ) : null}
      </div>
    </ServiceMapStateContextProvider>
  );
};

export default ServiceMap;
