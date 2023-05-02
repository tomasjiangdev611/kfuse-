import { Fingerprint } from 'types';
import { onPromiseError } from 'utils';
import query from './query';

type Args = {
  fpHash: string;
  timestamp: string;
};

const getFp = async ({ fpHash, timestamp }: Args): Promise<Fingerprint> => {
  return query<Fingerprint[], 'getFpList'>(`
    {
      getFpList(
        durationSecs: 1,
        logQuery: { eq: { facetName: "fp_hash", value: "${fpHash}" } },
        timestamp: "${timestamp}",
      ) {
        hash
        pattern
        source
        count
        events(limit: 1) {
          events {
            fpHash
            message
          }
        }
      }
    }
  `).then(
    (data) => (data.getFpList?.length ? data.getFpList[0] : null),
    onPromiseError,
  );
};

export default getFp;
