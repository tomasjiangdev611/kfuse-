import { Entity, Scalars } from 'types';
import query from './query';

type Args = {
  durationSeconds: number;
  krn: string;
  timestamp: Scalars['Time'];
};

const entityById = ({
  durationSeconds,
  krn,
  timestamp,
}: Args): Promise<Entity> =>
  query<Entity>(`
    {
      entityById(
      	entityId: {
          type: Pod,
          krn: "${krn}"
        },
      	timestamp: "${timestamp}",
        durationSeconds: ${durationSeconds},
      ) {
        id {
          krn
          type
        }
        ... on Pod {
          kubernetesCommon {
            baseEntity {
              attributes
              name
              deleteTime
              scrapeTime
            }
          }
        }
      }
    }
`).then((data) => (data?.entityById?.length ? data.entityById[0] : null));

export default entityById;
