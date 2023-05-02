import dayjs from 'dayjs';
import { Entity } from 'types';
import query from './query';

type Args = {
  startTimeUnix: number;
  endTimeUnix: number;
  entityType: string;
};

const getEntities = async ({
  startTimeUnix,
  endTimeUnix,
  entityType,
}: Args): Promise<Entity[]> => {
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
              attributes
              name
            }
          }
        }
      }
    }
`).then((data) => data?.getEntities || []);
};

export default getEntities;
