import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';
import { Node } from 'reactflow';

type SimNodeType = SimulationNodeDatum & Node;

const distance = 150;
const strength = -400;

const animateClusterLayout = ({ edges, nodes, setNodes }) => {
  if (!nodes.length) {
    return;
  }

  const simulationNodes: SimNodeType[] = nodes.map((node) => ({
    ...node,
    x: node.position?.x || 0,
    y: node.position?.y || 0,
  }));

  const simulationLinks: SimulationLinkDatum<SimNodeType>[] = edges.map(
    (edge) => ({ ...edge }),
  );

  return forceSimulation()
    .nodes(simulationNodes)
    .force('charge', forceManyBody().strength(strength))
    .force(
      'link',
      forceLink(simulationLinks)
        .id((d: any) => d.id)
        .strength(0.05)
        .distance(distance),
    )
    .force('x', forceX().x(0).strength(0.08))
    .force('y', forceY().y(0).strength(0.08))
    .on('tick', () => {
      setNodes(
        simulationNodes.map((node) => ({
          id: node.id,
          data: node.data,
          position: { x: node.x ?? 0, y: node.y ?? 0 },
          className: node.className,
          type: node.type,
        })),
      );
    });
};

export default animateClusterLayout;
