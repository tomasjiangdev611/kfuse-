import query from './query';

type Args = {
  durationMetric: string;
  failureMetric: string;
  fpHashes: string[];
  group: { [key: string]: string };
  name: string;
};

const saveTransaction = async ({
  durationMetric,
  failureMetric,
  fpHashes,
  group,
  name,
}: Args): Promise<Record<'saveTransaction', void>> => {
  return query<void, 'saveTransaction'>(`
    mutation {
      saveTransaction(
        txn: {
          name: "${name}"
          keys: "${Object.keys(group).join(',')}"
          path: "${fpHashes.join(',')}"
          durationMetric: "${durationMetric}"
          failureMetric:"${failureMetric}"
        }
      )
    }

  `);
};

export default saveTransaction;
