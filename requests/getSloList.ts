import { SLOProps } from 'types';
import { onPromiseError } from 'utils';

import queryTraceService from './queryTraceService';

const getSloList = async (): Promise<SLOProps[]> => {
  return queryTraceService<SLOProps[], 'getSLOs'>(`
    {
      getSLOs(get:true) {
        alertsFile
        alertUids
        annotations
        budget
        description
        errorExpr
        labels
        name
        rulesFile
        service
        timeWindow
        totalExpr
      }
    }
    `).then((data) => data.getSLOs || null, onPromiseError);
};

export default getSloList;
