import { useRequest, useUrlState } from 'hooks';
import { useRef, useState } from 'react';
import { getLogs } from 'requests';
import { onPromiseError } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const useLogsTable = () => {
  const appendLogsRequest = useRequest(getLogs);
  const cursorRefBitMapRef = useRef<{ [key: string]: number }>({});
  const cursorRef = useRef(null);
  const idRef = useRef(uuidv4());

  const [logs, setLogs] = useState([]);
  const logsForEntityRequest = useRequest(getLogs);
  const [sort, setSort] = useUrlState('sort', {
    sortBy: null,
    sortOrder: 'Desc',
  });

  const appendLogs = (logsState: any) => {
    const activeCursor = cursorRef.current;
    if (
      !logsForEntityRequest.isLoading &&
      !appendLogsRequest.isLoading &&
      activeCursor &&
      !cursorRefBitMapRef.current[activeCursor]
    ) {
      cursorRefBitMapRef.current[activeCursor] = 1;
      appendLogsRequest
        .call({
          cursor: activeCursor,
          ...logsState,
          sort,
        })
        .then(({ cursor, events }) => {
          cursorRef.current = cursor;
          setLogs((prevLogs) => [...prevLogs, ...events]);
        }, onPromiseError);
    }
  };

  const fetchLogs = (logsState: any) =>
    logsForEntityRequest
      .call({
        ...logsState,
        sort,
      })
      .then(({ cursor, events }) => {
        cursorRef.current = cursor;
        setLogs(events);
      }, onPromiseError);

  const sortByColumn = (nextSortBy: string, nextSortOrder: string) => {
    setSort((prevSort) => ({
      sortBy: nextSortBy,
      sortOrder: nextSortOrder,
    }));
  };

  const generateNewId = () => {
    idRef.current = uuidv4();
  };

  return {
    appendLogs,
    cursor: cursorRef.current,
    fetchLogs,
    generateNewId,
    id: idRef.current,
    isAppending: appendLogsRequest.isLoading,
    isLoading: logsForEntityRequest.isLoading,
    logs,
    sort,
    sortByColumn,
  };
};

export default useLogsTable;
