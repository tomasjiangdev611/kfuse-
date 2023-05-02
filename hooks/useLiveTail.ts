import { useUrlSearchParams, useToggle } from 'hooks';
import { useRef, useState } from 'react';
const URL_SEARCH_PARAM_KEY = 'live-tail';

const useLiveTail = (url: string, formatMessage?: (message: any) => any) => {
  const urlSearchParams = useUrlSearchParams();
  const isEnabledToggle = useToggle(false);

  const isPlayingToggle = useToggle();
  const [items, setItems] = useState([]);

  const socketRef = useRef<WebSocket>();

  const websocketUrl = `${
    window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  }//${window.location.hostname}:${window.location.port}${url}`;

  const closeSocket = () => {
    const socket = socketRef.current;
    if (socket) {
      socket.close();
    }

    socketRef.current = null;
  };

  const enableLiveTail = () => {
    setItems([]);
    isEnabledToggle.on();
    isPlayingToggle.on();
  };

  const init = () => {
    const liveTailEnabled = urlSearchParams.get(URL_SEARCH_PARAM_KEY);
    if (liveTailEnabled) {
      enableLiveTail();
      openSocketAndListen();
    }
  };

  const pauseLiveTail = () => {
    isPlayingToggle.off();
    closeSocket();
  };

  const resumeLiveTail = () => {
    isPlayingToggle.on();
    openSocketAndListen();
  };

  const startLiveTailIfNeeded = () => {
    if (!isPlayingToggle.value) {
      isEnabledToggle.on();
      isPlayingToggle.on();
      openSocketAndListen();
    }
  };

  const stopLiveTail = () => {
    isEnabledToggle.off();
    isPlayingToggle.off();
    closeSocket();

    setItems([]);
  };

  const toggleLiveTail = () => {
    if (isPlayingToggle.value) {
      pauseLiveTail();
    } else {
      resumeLiveTail();
    }
  };

  const openSocketAndListen = () => {
    closeSocket();
    const socket = new WebSocket(websocketUrl);

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        const nextItem = formatMessage ? formatMessage(data) : data;
        setItems((prevItems) => [nextItem, ...prevItems]);
      } catch (e) {
        console.error(e, event.data);
      }
    });

    socketRef.current = socket;
  };

  return {
    closeSocket,
    enableLiveTail,
    isEnabled: isEnabledToggle.value,
    init,
    isPlaying: isPlayingToggle.value,
    items,
    pauseLiveTail,
    startLiveTailIfNeeded,
    stopLiveTail,
    toggleLiveTail,
  };
};

export default useLiveTail;
