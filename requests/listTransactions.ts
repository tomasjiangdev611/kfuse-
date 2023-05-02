import { Transaction } from 'types';
import { onPromiseError } from 'utils';
import query from './query';

const listTransactions = async (): Promise<any> => {
  return query<Transaction[], 'listTransactions'>(`
    {
      listTransactions {
        startPattern
        endPattern
        name
        keys
        durationMetric
        failureMetric
      }
    }
  `).then((data) => data?.listTransactions || [], onPromiseError);
};

export default listTransactions;
