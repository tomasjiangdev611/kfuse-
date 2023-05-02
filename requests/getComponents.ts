import dayjs from 'dayjs';
import { Component } from 'types';
import query from './query';

type Args = {
  startTimeUnix: number;
  endTimeUnix: number;
  entityType: string;
};

const getComponents = async ({
  startTimeUnix,
  endTimeUnix,
}: Args): Promise<Component[]> => {
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;

  return query<Component[], 'getComponents'>(`
    {
      getComponents(timestamp: "${endTime.format()}", durationSeconds: ${durationSecs}) {
        name
        entities {
          id {
            krn
            type
          }
          ... on Application {
            baseEntity {
              name
            }
          }
          ... on KafkaCluster {
            baseEntity {
              name
            }
          }
        }
      }
    }

`).then((data) => data?.getComponents || []);
};

export default getComponents;
