/* eslint-env browser */
import { useRef } from 'react';
import { MouseMoverCoordinates } from './types';

type MouseMoverCallbacks = {
  onMouseDown: () => void;
  onMouseMove: (coordinates: MouseMoverCoordinates) => void;
  onMouseUp: () => void;
};

type Result = {
  onMouseDown: (e: MouseEvent) => void;
};

const useMouseMover = (callbacks: MouseMoverCallbacks): Result => {
  const ref = useRef<MouseMoverCoordinates>({
    deltaX: 0,
    deltaY: 0,
    clientX: 0,
    clientY: 0,
  });

  const setRef = (
    next: (coordinates: MouseMoverCoordinates) => MouseMoverCoordinates,
  ) => {
    const prev = ref.current;
    ref.current = next(prev);
  };

  const didMouseMove = () => {
    if (callbacks.onMouseMove) {
      callbacks.onMouseMove(ref.current);
    }

    setRef((prev) => ({
      ...prev,
      deltaX: 0,
      deltaY: 0,
    }));
  };

  const onMouseDown = (e: MouseEvent) => {
    const onMouseMove = (e: MouseEvent) => {
      // e.preventDefault();
      const { clientX, clientY } = e;

      setRef((prev) => ({
        deltaX: prev.deltaX + clientX - prev.clientX,
        deltaY: prev.deltaY + clientY - prev.clientY,
        clientX,
        clientY,
      }));

      didMouseMove();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove, false);
      window.removeEventListener('mouseup', onMouseUp, false);
      if (callbacks.onMouseUp) {
        callbacks.onMouseUp();
      }
    };

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);

    const { clientX, clientY } = e;
    setRef(() => ({
      deltaX: 0,
      deltaY: 0,
      clientX: clientX,
      clientY: clientY,
    }));
  };

  return {
    onMouseDown,
  };
};

export default useMouseMover;
