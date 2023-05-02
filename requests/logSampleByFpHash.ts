import dayjs from 'dayjs';
import { LogEvent } from 'types';
import { escapePeriod, onPromiseError } from 'utils';
import query from './query';

type Group = { [key: string]: string };

const getFilter = (group: Group) => {
  let result = '';
  Object.keys(group).forEach((key) => {
    result += `{ keyExists: "@${escapePeriod(key)}" }\n`;
  });

  return result;
};

type Args = {
  durationSecs: number;
  endTs: Date;
  fpHash: string;
  group: Group;
};

const logSampleByFpHash = async ({
  durationSecs,
  endTs,
  fpHash,
  group,
}: Args): Promise<LogEvent> => {
  const filter = getFilter(group);
  return query<LogEvent, 'logSample'>(`
    {
      logSample(
        fingerprints: ["${fpHash}"]
        query: {
          and: [
            ${filter}
          ]
        }
        timestamp: "${dayjs(endTs).add(5, 'seconds').format()}"
        ${durationSecs ? `durationSecs: ${durationSecs + 5}` : ''}
      ) {
        timestamp
        message
        fpHash
        fpPattern
        level
        labels
        facets
      }
    }
  `).then(
    (data) => (data.logSample?.length ? data.logSample[0] : null),
    onPromiseError,
  );
};

export default logSampleByFpHash;
