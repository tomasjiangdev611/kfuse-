import dayjs from 'dayjs';
import {
  DateSelection,
  Entity,
  EntityId,
  KnightLink,
  KnightNode,
  PodTrafficConnection,
} from 'types';
import entityById from './entityById';
import query from './query';

const fetchEntitiesHandler =
  (timestamp: string, durationSeconds: number) =>
  async ({ links, linksById, nodes, nodesById }: Result) => {
    const entities = await Promise.all(
      nodes.map((node) =>
        entityById({ krn: node.id, durationSeconds, timestamp }),
      ),
    );

    const entitiesById: { [key: string]: Entity } = entities
      .filter((entity) => entity)
      .reduce((obj, entity) => ({ ...obj, [entity.id.krn]: entity }), {});

    return {
      links,
      linksById,
      nodes: nodes.map((node) => ({ ...entitiesById[node.id], id: node.id })),
      nodesById,
    };
  };

const parseTrafficConnections = (
  trafficConnections: PodTrafficConnection[],
) => {
  const nodesById: { [key: string]: EntityId } = {};
  const linksById: { [key: string]: KnightLink } = {};
  const links: KnightLink[] = [];

  trafficConnections.forEach((trafficConnection) => {
    const { clientId, serverId } = trafficConnection;
    [clientId, serverId].forEach((entity) => {
      nodesById[entity.krn] = entity;
    });

    const source = clientId.krn;
    const target = serverId.krn;
    const linkId = `${source}:${target}`;

    if (!linksById[linkId]) {
      const link = {
        id: linkId,
        source,
        target,
        ...trafficConnection,
      };

      links.push(link);

      linksById[linkId] = link;
    }
  });

  const nodes: KnightNode[] = Object.values(nodesById).map((entity) => ({
    id: entity.krn,
  }));

  return {
    linksById,
    links,
    nodes,
    nodesById,
  };
};

type Args = {
  date: DateSelection;
  protocol: string;
};

type Result = {
  linksById: { [key: string]: KnightLink };
  links: KnightLink[];
  nodes: KnightNode[];
  nodesById: { [key: string]: EntityId };
};

const podTrafficConnections = async ({
  date,
  protocol,
}: Args): Promise<Result> => {
  const { endTimeUnix, startTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const timestamp = endTime.format();
  const durationSeconds = endTimeUnix - startTimeUnix;
  return query<PodTrafficConnection[], 'podTrafficConnections'>(`{
      podTrafficConnections(
        protocol: ${protocol}
        podId: {type: Pod, krn: "df3e10f2-e5bc-49b8-8a7b-885614d2d05b"}
        timestamp: "${timestamp}"
        durationSeconds: ${durationSeconds}
      ) {
        serverId {
          krn
          type
        }
        clientId {
          krn
          type
        }
        protocol
        tags
        timeRange {
          start
          end
        }
      }
    }
`)
    .then((data) => data?.podTrafficConnections || [])
    .then(parseTrafficConnections)
    .then(fetchEntitiesHandler(timestamp, durationSeconds));
};

export default podTrafficConnections;
