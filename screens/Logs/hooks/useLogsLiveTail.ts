import { useToggle } from 'hooks';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildQuery } from 'requests';
import { transformGRAPQLQueryToJSON } from 'utils';
import { v4 as uuidv4 } from 'uuid';

const URL_SEARCH_PARAM_KEY = 'live-tail';

const websocketUrl = (logsState: any) => {
  const urlSearchParams = new URLSearchParams();

  const logQuery = buildQuery({
    ...logsState,
  });

  urlSearchParams.set(
    'logQuery',
    JSON.stringify(transformGRAPQLQueryToJSON(logQuery)),
  );

  return `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
    window.location.hostname
  }:${window.location.port}/log/livetail?${urlSearchParams.toString()}`;
};

const useLogsLiveTail = () => {
  const navigate = useNavigate();
  const idRef = useRef(uuidv4());
  const isEnabledToggle = useToggle(false);
  const prevSearchParamValueRef = useRef<boolean>(false);

  const isPlayingToggle = useToggle();
  const [liveTailLogs, setLiveTailLogs] = useState([]);

  const socketRef = useRef<WebSocket>();

  const closeSocket = () => {
    const socket = socketRef.current;
    if (socket) {
      socket.close();
    }

    socketRef.current = null;
  };

  const enableLiveTail = () => {
    const search = window.location.href.split('?')[1] || '';
    const nextUrlSearchParams = new URLSearchParams(`?${search}`);
    nextUrlSearchParams.set(URL_SEARCH_PARAM_KEY, 'true');
    navigate(`/logs?${nextUrlSearchParams.toString()}`);

    idRef.current = uuidv4();
    setLiveTailLogs([]);
    isEnabledToggle.on();
    isPlayingToggle.on();
  };

  const init = (logsState: any) => {
    const search = window.location.href.split('?')[1] || '';
    const urlSearchParams = new URLSearchParams(`?${search}`);
    const liveTailEnabled = urlSearchParams.get(URL_SEARCH_PARAM_KEY);
    if (!prevSearchParamValueRef.current && liveTailEnabled) {
      enableLiveTail();
      openSocketAndListen(logsState);
      prevSearchParamValueRef.current = true;
    } else {
      prevSearchParamValueRef.current = false;
    }
  };

  const pauseLiveTail = () => {
    isPlayingToggle.off();
    closeSocket();
  };

  const resumeLiveTail = (logsState: any) => {
    isPlayingToggle.on();
    openSocketAndListen(logsState);
  };

  const startLiveTailfNeeded = (logsState: any) => {
    if (isPlayingToggle.value) {
      openSocketAndListen(logsState);
    }
  };

  const stopLiveTail = () => {
    const search = window.location.href.split('?')[1] || '';
    const nextUrlSearchParams = new URLSearchParams(`?${search}`);
    nextUrlSearchParams.delete(URL_SEARCH_PARAM_KEY);
    const previousUrl = window.location.href.split('?')[0];
    window.history.replaceState(
      '',
      '',
      `${previousUrl}?${nextUrlSearchParams.toString()}`,
    );

    isEnabledToggle.off();
    isPlayingToggle.off();
    closeSocket();

    setLiveTailLogs([]);
  };

  const toggleLiveTail = (logsState: any) => {
    if (isPlayingToggle.value) {
      pauseLiveTail();
    } else {
      resumeLiveTail(logsState);
    }
  };

  const openSocketAndListen = (logsState: any) => {
    closeSocket();
    const socket = new WebSocket(websocketUrl(logsState));

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      setLiveTailLogs((prevLogs) => [data, ...prevLogs]);
    });

    socketRef.current = socket;
  };

  return {
    enableLiveTail,
    id: idRef.current,
    isEnabled: isEnabledToggle.value,
    init,
    isPlaying: isPlayingToggle.value,
    liveTailLogs,
    pauseLiveTail,
    startLiveTailfNeeded,
    stopLiveTail,
    toggleLiveTail,
  };
};

export default useLogsLiveTail;
