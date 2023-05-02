import dayjs from 'dayjs';
import { Entity } from 'types';
import { findDiffs } from 'utils';
import query from './query';

const parseEntities = (entities: Entity[]) => {
  const entitySnapshotsByKrn: { [krn: string]: any } = {};
  const entitySnapshotDiffsByKrn: { [krn: string]: { [time: string]: any } } =
    {};
  const entitySnapshotByTimeByKrn: { [krn: string]: { [time: string]: any } } =
    {};

  entities.forEach((entitySnapshot) => {
    const { id } = entitySnapshot;
    const { krn } = id;

    if (!entitySnapshotsByKrn[krn]) {
      entitySnapshotsByKrn[krn] = [];
    }

    entitySnapshotsByKrn[krn].push(entitySnapshot);
  });

  Object.keys(entitySnapshotsByKrn).forEach((krn) => {
    entitySnapshotDiffsByKrn[krn] = {};
    entitySnapshotByTimeByKrn[krn] = {};

    const sortedEntitySnapshots = entitySnapshotsByKrn[krn].sort((a, b) => {
      const dateA = dayjs(a.kubernetesCommon.baseEntity.scrapeTime);
      const dateB = dayjs(b.kubernetesCommon.baseEntity.scrapeTime);
      return dateA.diff(dateB);
    });

    sortedEntitySnapshots.forEach((entitySnapshot, index) => {
      if (index === 0) {
        entitySnapshotDiffsByKrn[krn].base =
          entitySnapshot.kubernetesCommon.baseEntity.attributes;
        entitySnapshotByTimeByKrn[krn].base =
          entitySnapshot.kubernetesCommon.baseEntity.attributes;
      } else {
        const diff = findDiffs(
          sortedEntitySnapshots[index - 1].kubernetesCommon.baseEntity
            .attributes,
          entitySnapshot.kubernetesCommon.baseEntity.attributes,
        );

        if (Object.keys(diff).length) {
          entitySnapshotDiffsByKrn[krn][
            entitySnapshot.kubernetesCommon.baseEntity.scrapeTime
          ] = diff;
        }

        entitySnapshotByTimeByKrn[krn][
          entitySnapshot.kubernetesCommon.baseEntity.scrapeTime
        ] = entitySnapshot.kubernetesCommon.baseEntity.attributes;
      }
    });
  });

  return { entitySnapshotDiffsByKrn, entitySnapshotByTimeByKrn };
};

type Args = {
  entityType: string;
  startTimeUnix: number;
  endTimeUnix: number;
};

const getEntitiesWithAttributes = async ({
  startTimeUnix,
  endTimeUnix,
  entityType,
}: Args) => {
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return query<Entity[], 'getEntities'>(`
    {
      getEntities(
        entityType: ${entityType}
        timestamp: "${endTime.format()}"
        durationSeconds: ${durationSecs}
      ) {
        id {
          krn
          type
        }... on ${entityType} {
          kubernetesCommon {
          baseEntity {
            scrapeTime
            deleteTime
            attributes
          }
          }
        }
      }
    }
`)
    .then((data) => data?.getEntities)
    .then(parseEntities);
};

export default getEntitiesWithAttributes;
