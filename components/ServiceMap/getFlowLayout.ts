import dagre from 'dagre';
import { circleDiameter, labelHeight, labelWidth } from './constants';
import { Orientation } from './types';

const findNodeByEdge = ({ map, nodeId, nodesBitmap }) => {
  const nodeIds = map[nodeId];
  if (nodeIds) {
    nodeIds.forEach((nextNodeId) => {
      if (!nodesBitmap[nextNodeId]) {
        nodesBitmap[nextNodeId] = 1;
        findNodeByEdge({ map, nodeId: nextNodeId, nodesBitmap });
      }
    });
  }
};

const buildEdgeMap = ({ edges, shouldUseSourceAsKey }) => {
  return edges.reduce((obj, edge) => {
    const nextObj = { ...obj };
    const { source, target } = edge;

    const key = shouldUseSourceAsKey ? source : target;
    const value = shouldUseSourceAsKey ? target : source;

    if (!nextObj[key]) {
      nextObj[key] = [];
    }

    nextObj[key].push(value);

    return nextObj;
  }, {});
};

const getNodesWithFocus = ({ edges, nodes, focusedNodeId }) => {
  const sourcesByTarget = buildEdgeMap({ edges, shouldUseSourceAsKey: false });
  const targetsBySource = buildEdgeMap({ edges, shouldUseSourceAsKey: true });

  const nodesBitmap = { [focusedNodeId]: 1 };
  findNodeByEdge({
    map: sourcesByTarget,
    nodeId: focusedNodeId,
    nodesBitmap,
  });

  findNodeByEdge({
    map: targetsBySource,
    nodeId: focusedNodeId,
    nodesBitmap,
  });

  return nodes.filter((node) => nodesBitmap[node.id]);
};

const getNodesWithErrors = ({ edges, nodes }) => {
  const sourcesByTarget = buildEdgeMap({ edges, shouldUseSourceAsKey: false });
  const targetsBySource = buildEdgeMap({ edges, shouldUseSourceAsKey: true });

  const nodesBitmap = {};
  const nodesWithErrors = nodes.filter((node) => node.data.hasError);

  nodesWithErrors.forEach((node) => {
    nodesBitmap[node.id] = 1;
    findNodeByEdge({
      map: sourcesByTarget,
      nodeId: node.id,
      nodesBitmap,
    });

    findNodeByEdge({
      map: targetsBySource,
      nodeId: node.id,
      nodesBitmap,
    });
  });

  return nodes.filter((node) => nodesBitmap[node.id]);
};

const getNodesWithoutEdges = ({ edges, nodes }) => {
  const nodesBitmap = nodes.reduce(
    (obj, node) => ({ ...obj, [node.id]: 1 }),
    {},
  );

  const nodesWithEdgeBitmap = edges
    .filter((edge) => nodesBitmap[edge.source] && nodesBitmap[edge.target])
    .reduce(
      (obj, edge) => ({
        ...obj,
        [edge.source]: 1,
        [edge.target]: 1,
      }),
      {},
    );

  return nodes.filter((node) => nodesWithEdgeBitmap[node.id]);
};

const getSearchedNodes = ({ edges, nodes, search }) => {
  const sourcesByTarget = buildEdgeMap({ edges, shouldUseSourceAsKey: false });
  const targetsBySource = buildEdgeMap({ edges, shouldUseSourceAsKey: true });

  const searchLowered = search.toLowerCase();
  const searchedNodes = nodes.filter(
    (node) => node.id.toLowerCase().indexOf(searchLowered) > -1,
  );
  const nodesBitmap = {};

  searchedNodes.forEach((node) => {
    if (!nodesBitmap[node.id]) {
      nodesBitmap[node.id] = 1;
      findNodeByEdge({
        map: sourcesByTarget,
        nodeId: node.id,
        nodesBitmap,
      });

      findNodeByEdge({
        map: targetsBySource,
        nodeId: node.id,
        nodesBitmap,
      });
    }
  });

  return nodes.filter((node) => nodesBitmap[node.id]);
};

const getFilteredNodes = ({ customFilters, edges, nodes, serviceMapState }) => {
  const { state } = serviceMapState;
  const {
    customFilterState,
    focusedNodeId,
    hideDanglingNodes,
    search,
    showOnlyPathsWithErrors,
  } = state;
  let result = [...nodes];

  if (customFilters.length) {
    customFilters
      .filter((customFilter) => customFilterState[customFilter.key])
      .forEach((customFilter) => {
        result = customFilter.filter({ edges, nodes });
      });
  }

  if (focusedNodeId) {
    result = getNodesWithFocus({
      edges,
      nodes: result,
      focusedNodeId,
    });
  }

  if (search) {
    result = getSearchedNodes({ edges, nodes: result, search });
  }

  if (showOnlyPathsWithErrors) {
    result = getNodesWithErrors({
      edges,
      nodes: result,
    });
  }

  if (hideDanglingNodes) {
    result = getNodesWithoutEdges({
      edges,
      nodes: result,
    });
  }

  return result;
};

const getFilteredEdges = ({ edges, nodesById }) => {
  return edges
    .filter((edge) => nodesById[edge.source] || nodesById[edge.target])
    .map((edge) => ({
      ...edge,
      id: `${edge.source}->${edge.target}`,
      type: 'custom',
    }));
};

const getFlowLayout = ({ customFilters, edges, nodes, serviceMapState }) => {
  const isHorizontal =
    serviceMapState.state.orientation === Orientation.horizontal;

  const nodeHeight = isHorizontal
    ? circleDiameter + labelHeight
    : circleDiameter;
  const nodeWidth = isHorizontal ? labelWidth : circleDiameter + labelWidth;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: isHorizontal ? 'LR' : 'TB' });

  const filteredNodes = getFilteredNodes({
    customFilters,
    edges,
    nodes,
    serviceMapState,
  });

  filteredNodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  const nodesById = filteredNodes.reduce(
    (obj, node) => ({ ...obj, [node.id]: 1 }),
    {},
  );
  const filteredEdges = getFilteredEdges({ edges, nodesById });

  filteredEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = filteredNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      targetPosition: isHorizontal ? 'left' : 'top',
      type: 'custom',
    };
  });

  return { edges: filteredEdges, nodes: layoutedNodes };
};

export default getFlowLayout;
