import { Edge, Node } from 'reactflow';
import useServiceMapState from './useServiceMapState';

const getEdgesWithState = ({ edges, serviceMapState }) => {
  const { hoveredEdgeId, hoveredNodeId } = serviceMapState.state;
  if (hoveredNodeId || hoveredEdgeId) {
    return edges.map((edge) => {
      const animated =
        hoveredNodeId === edge.source ||
        hoveredNodeId === edge.target ||
        hoveredEdgeId === edge.id;
      return {
        ...edge,
        animated,
        style: animated
          ? {
              stroke: '#3d8bc9',
              strokeWidth: 3,
            }
          : {},
        zIndex: animated ? 1 : 0,
      };
    });
  }

  return edges;
};

const getNodesWithState = ({ edges, nodes, serviceMapState }) => {
  return nodes;
};

type Args = {
  edges: Edge[];
  nodes: Node[];
  serviceMapState: ReturnType<typeof useServiceMapState>;
};

const getLayoutWithState = ({ edges, nodes, serviceMapState }: Args) => {
  return {
    edges: getEdgesWithState({ edges, serviceMapState }),
    nodes: getNodesWithState({ edges, nodes, serviceMapState }),
  };
};

export default getLayoutWithState;
