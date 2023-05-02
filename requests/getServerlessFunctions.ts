import { onPromiseError } from 'utils';

import queryEventService from './queryEventService';

type Result = { [key: string]: any };

const getServerlessFunctions = async (): Promise<Result> => {
  return queryEventService<string[], 'serverlessFunctions'>(`
    {
      serverlessFunctions
    }
  `).then((data) => {
    const result: Result = {};
    (data.serverlessFunctions || []).forEach((str) => {
      try {
        const serverlessFunction = JSON.parse(str);
        if (serverlessFunction?.FunctionName) {
          result[serverlessFunction.FunctionName] = serverlessFunction;
        }
      } catch (e) {
        // ignore
      }
    });

    return result;
  }, onPromiseError);
};

export default getServerlessFunctions;
