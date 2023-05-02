import React, { useRef } from 'react';
import useToggle from './useToggle';

const websocketUrl = `${
  window.location.protocol === 'https:' ? 'wss:' : 'ws:'
}//${window.location.hostname}:${window.location.port}/query`;

const useWebsocket = ({ onMessage, queryBuilder }) => {
  const socketRef = useRef(null);
  const isConnectedToggle = useToggle();

  const start = (props: any) => {
    isConnectedToggle.on();
    const socket = new WebSocket(websocketUrl, 'graphql-ws');
    socket.addEventListener('open', (event) => {
      socket.send(JSON.stringify({ type: 'connection_init' }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connection_ack') {
        socket.send(
          JSON.stringify({
            id: '1',
            type: 'start',
            payload: {
              variables: {},
              extensions: {},
              operationName: null,
              query: queryBuilder(props),
            },
          }),
        );
      }

      if (data.type === 'data' && data.payload?.data) {
        onMessage(data);
      }
    });

    socketRef.current = socket;
  };

  const stop = () => {
    isConnectedToggle.off();
    const socket = socketRef.current;
    if (socket) {
      socket.close();
    }

    socketRef.current = null;
  };

  return {
    isConnected: isConnectedToggle.value,
    start,
    stop,
  };
};

export default useWebsocket;
