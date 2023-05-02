import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

const deleteSlo = async (sloName: string): Promise<boolean> => {
  return queryTraceService<boolean, 'deleteSLO'>(`
        { deleteSLO (sloName: "${sloName}") }
    `).then((data) => data.deleteSLO || null, onPromiseError);
};

export default deleteSlo;
