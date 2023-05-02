import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { RequestResult } from 'types';
import { onPromiseError } from 'utils';

/**
 * fetch logs from server
 * @param data - data to be set in the state
 * @param method
 */
export const fetchLogs = (
  data: any,
  method: {
    cursorRef: MutableRefObject<string | null>;
    logsForEntityRequest: RequestResult;
    setLogs: Dispatch<SetStateAction<any[]>>;
  },
): void => {
  const { logsForEntityRequest, cursorRef, setLogs } = method;
};
