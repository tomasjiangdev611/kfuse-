import { delimiter } from 'constants';
import dayjs from 'dayjs';
import {
  useLocalStorageState,
  useMap,
  useRequest,
  useToggle,
  useUrlState,
} from 'hooks';
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildQuery, getLogs } from 'requests';

import { fetchLogs } from '../fetch';
import { FacetBase, LabelsProps } from '../types';
import { SearchItemProps } from '../LogsSearchBar/types';
import { onPromiseError } from 'utils';
import useDateState from './useDateState';

const clearSelectedFacetValuesByFacetKey = (
  facetKey: string,
  prevDeselectedFacetValues: { [key: string]: number },
) => {
  return Object.keys(prevDeselectedFacetValues)
    .filter(
      (facetValueCompositeKey) =>
        facetValueCompositeKey.split(delimiter).slice(0, 2).join(delimiter) !==
        facetKey,
    )
    .reduce(
      (obj, facetValueCompositeKey) => ({
        ...obj,
        [facetValueCompositeKey]:
          prevDeselectedFacetValues[facetValueCompositeKey],
      }),
      {},
    );
};

const websocketUrl = `${
  window.location.protocol === 'https:' ? 'wss:' : 'ws:'
}//${window.location.hostname}:${window.location.port}/query`;

const endTimeUnix = dayjs().unix();
const startTimeUnix = dayjs()
  .subtract(60 * 5, 'seconds')
  .unix();

const useLogsState = () => {
  const loadingByComponentMap = useMap();
  const loadingByFacetKeyMap = useMap();
  const [params, setParams] = useSearchParams();

  const [date, setDate] = useDateState('date', {
    startLabel: 'now-5m',
    endLabel: 'now',
    endTimeUnix,
    startTimeUnix,
  });
  const [selectedFacetValues, setSelectedFacetValues] = useUrlState(
    'selectedFacetValues',
    {},
  );
  const [filterOrExcludeByFingerprint, setFilterOrExcludeByFingerprint] =
    useUrlState('filterOrExcludeByFingerprint', {});
  const [keyExists, setKeyExists] = useUrlState('keyExists', {});
  const [filterByFacets, setFilterByFacets] = useUrlState('filterByFacets', []);
  const [searchTerms, setSearchTerms] = useUrlState('searchTerms', []);
  const [sort, setSort] = useUrlState('sort', {
    sortBy: null,
    sortOrder: 'Desc',
  });
  const [labels, setLabels] = useState<LabelsProps>();

  const hasStartedLiveTailToggle = useToggle();
  const liveTailToggle = useToggle();

  const appendLogsRequest = useRequest(getLogs);
  const logsForEntityRequest = useRequest(getLogs);

  const [absoluteTimeRangeStorage, setabsoluteTimeRangeStorage] =
    useLocalStorageState('AbsoluteTimeRange', []);

  const socketRef = useRef();

  const getSearchFilterState = () => {
    return {
      date,
      selectedFacetValues,
      filterByFacets,
      filterOrExcludeByFingerprint,
      keyExists,
      searchTerms,
      sort,
    };
  };

  const getFetchMethod = (fetchType: string): any => {
    switch (fetchType) {
      case 'fetchLogs':
        return { cursorRef, logsForEntityRequest, setLogs };
      default:
        return {};
    }
  };

  const cursorRef = useRef(null);
  const cursorRefBitMapRef = useRef({});

  const [liveTailLogs, setLiveTailLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [width, setWidth] = useState(0);

  /** filter by facets start */
  const addFilterByFacet = ({
    facetName,
    value,
    operator,
  }: SearchItemProps) => {
    const newFilterByFacets = [...filterByFacets];
    newFilterByFacets.push(`${facetName}${operator}"${value}"`);
    setFilterByFacets(newFilterByFacets);
  };

  const removeFilterByFacetByIndex = (index: number) => {
    const newFilterByFacets = [...filterByFacets];
    newFilterByFacets.splice(index, 1);
    setFilterByFacets(newFilterByFacets);
  };
  /** filter by facet end **/

  const addSearchTerm = (searchTerm) => {
    setSearchTerms((prevSearchTerms) => {
      const nextSearchTerms = [...prevSearchTerms, searchTerm];
      return nextSearchTerms;
    });
  };

  const appendLogs = () => {
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
          date,
          selectedFacetValues,
          filterByFacets,
          filterOrExcludeByFingerprint,
          keyExists,
          searchTerms,
          sort,
        })
        .then(({ cursor, events }) => {
          cursorRef.current = cursor;
          setLogs((prevLogs) => [...prevLogs, ...events]);
        }, onPromiseError);
    }
  };

  const clearFilterOrExcludeByFingerprint = (fpHash) => {
    setFilterOrExcludeByFingerprint((prevFilterOrExcludeByFingerprint) => {
      const nextFilterOrExcludeByFingerprint = {
        ...prevFilterOrExcludeByFingerprint,
      };
      delete nextFilterOrExcludeByFingerprint[fpHash];
      return nextFilterOrExcludeByFingerprint;
    });
  };

  const excludeFingerprint = (fpHash: string) => {
    setFilterOrExcludeByFingerprint((prevFilterOrExcludeByFingerprint) => {
      const nextFilterOrExcludeByFingerprint = {
        ...prevFilterOrExcludeByFingerprint,
      };
      nextFilterOrExcludeByFingerprint[fpHash] = false;
      return nextFilterOrExcludeByFingerprint;
    });
  };

  const filterFingerpint = (fpHash: string) => {
    setFilterOrExcludeByFingerprint((prevFilterOrExcludeByFingerprint) => {
      const nextFilterOrExcludeByFingerprint = {
        ...prevFilterOrExcludeByFingerprint,
      };
      nextFilterOrExcludeByFingerprint[fpHash] = true;

      return nextFilterOrExcludeByFingerprint;
    });
  };

  const init = () => {
    fetchLogs(getSearchFilterState(), getFetchMethod('fetchLogs'));
  };

  const applyDeselectedFacetValues = ({
    component,
    facetName,
    facetValuesToSelect,
  }) => {
    const facetKey = `${component}${delimiter}${facetName}`;
    setSelectedFacetValues((prevDeselectedFacetValues) => {
      const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
        facetKey,
        prevDeselectedFacetValues,
      );

      return {
        ...nextSelectedFacetValues,
        ...facetValuesToSelect,
      };
    });
  };

  const filterOnlyFacetValueFromLogEventDetail = async ({
    name,
    source,
    value,
    exclude = false,
  }) => {
    const facetKey = `${source}${delimiter}${name}`;
    const facetValueCompositeKey = `${facetKey}${delimiter}${value}`;

    setSelectedFacetValues((prevDeselectedFacetValues) => {
      const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
        facetKey,
        prevDeselectedFacetValues,
      );

      nextSelectedFacetValues[facetValueCompositeKey] = exclude ? 0 : 1;

      return nextSelectedFacetValues;
    });
  };

  const removeSearchTermByIndex = (i: number) => {
    setSearchTerms((prevSearchTerms) => {
      const nextSearchTerms = [...prevSearchTerms];
      nextSearchTerms.splice(i, 1);

      return nextSearchTerms;
    });
  };

  const resetFacet = ({ component, name }: FacetBase) => {
    const facetKey = `${component}${delimiter}${name}`;

    setSelectedFacetValues((prevEnabledFacetValues) => {
      const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
        facetKey,
        prevEnabledFacetValues,
      );

      return nextSelectedFacetValues;
    });
  };

  const closeSocket = () => {
    const socket = socketRef.current;
    if (socket) {
      socket.close();
    }

    socketRef.current = null;
  };

  const openSocketAndListen = () => {
    closeSocket();
    const socket = new WebSocket(websocketUrl, 'graphql-ws');
    socket.addEventListener('open', (event) => {
      socket.send(JSON.stringify({ type: 'connection_init' }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connection_ack') {
        const logQuery = buildQuery({
          ...getSearchFilterState(),
          logLevel: null,
        });

        socket.send(
          JSON.stringify({
            id: '1',
            type: 'start',
            payload: {
              variables: {},
              extensions: {},
              operationName: null,
              query: `subscription {\n  liveTail${
                logQuery ? `(logQuery: ${logQuery})` : ''
              } {\n   facets\n message\n labels\n level\n timestamp\n  }\n}\n`,
            },
          }),
        );
      }

      if (data.type === 'data' && data.payload?.data?.liveTail) {
        setLiveTailLogs((prevLogs) => [
          data.payload.data.liveTail,
          ...prevLogs,
        ]);
      }
    });

    socketRef.current = socket;
  };

  const startLiveTail = () => {
    setLiveTailLogs([]);
    liveTailToggle.on();
    hasStartedLiveTailToggle.on();

    openSocketAndListen();
  };

  const pauseLiveTail = () => {
    liveTailToggle.off();
    closeSocket();
  };

  const resumeLiveTail = () => {
    liveTailToggle.on();
    openSocketAndListen();
  };

  const stopLiveTail = () => {
    const nextParams = {};
    params.forEach((value, key) => {
      if (key !== 'live-tail') {
        nextParams[key] = value;
      }
    });

    setParams(nextParams);

    hasStartedLiveTailToggle.off();
    liveTailToggle.off();
    closeSocket();

    setLiveTailLogs([]);
  };

  const sortByColumn = (nextSortBy: string) => {
    setSort((prevSort) => ({
      sortBy: nextSortBy,
      sortOrder:
        nextSortBy === prevSort.sortBy && prevSort.sortOrder === 'Asc'
          ? 'Desc'
          : 'Asc',
    }));
  };

  const toggleLiveTail = () => {
    if (liveTailToggle.value) {
      pauseLiveTail();
    } else {
      resumeLiveTail();
    }
  };

  const toggleFacetValue = (facetKey: string, nextSelectionByFacetKeys) => {
    setSelectedFacetValues((prevDeselectedFacetValues) => {
      const nextSelectedFacetValues = clearSelectedFacetValuesByFacetKey(
        facetKey,
        prevDeselectedFacetValues,
      );

      return {
        ...nextSelectedFacetValues,
        ...nextSelectionByFacetKeys,
      };
    });
  };

  const toggleKeyExists = ({ component, name, type }: FacetBase) => {
    const facetKeyWithType = `${component}${delimiter}${name}${delimiter}${type}`;

    setKeyExists((prevKeyExists) => {
      const nextKeyExists = {
        ...prevKeyExists,
        [facetKeyWithType]: prevKeyExists[facetKeyWithType] ? 0 : 1,
      };

      return nextKeyExists;
    });
  };

  return {
    absoluteTimeRangeStorage,
    addFilterByFacet,
    addSearchTerm,
    appendLogs,
    applyDeselectedFacetValues,
    calledAtLeastOnce: logsForEntityRequest.calledAtLeastOnce,
    clearFilterOrExcludeByFingerprint,
    cursor: cursorRef.current,
    date,
    selectedFacetValues,
    excludeFingerprint,
    filterByFacets,
    filterOnlyFacetValueFromLogEventDetail,
    filterFingerpint,
    filterOrExcludeByFingerprint,
    getFetchMethod,
    getSearchFilterState,
    hasStartedLiveTailToggle,
    init,
    isAppending: appendLogsRequest.isLoading,
    isLoading: logsForEntityRequest.isLoading,
    keyExists,
    labels,
    liveTailToggle,
    liveTailLogs,
    loadingByComponent: loadingByComponentMap.state,
    loadingByFacetKey: loadingByFacetKeyMap.state,
    logs,
    openSocketAndListen,
    removeFilterByFacetByIndex,
    removeSearchTermByIndex,
    resetFacet,
    search,
    searchTerms,
    setabsoluteTimeRangeStorage,
    setDate: (nextDate) => {
      stopLiveTail();
      setDate(nextDate);
    },
    setFilterByFacets,
    setLabels,
    setSearch,
    setWidth: (nextWidth) => {
      setWidth(nextWidth);
    },
    pauseLiveTail,
    sort,
    sortByColumn,
    stopLiveTail,
    startLiveTail,
    toggleKeyExists,
    toggleLiveTail,
    toggleFacetValue,
    width,
  };
};

export default useLogsState;
