import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

import { ToastProps } from './types';

const useToastmaster = () => {
  const [toastsById, setToastsById] = useState<{ [id: string]: any }>({});

  const addToast = ({ status, text, timeout }: ToastProps) => {
    const id = uuidv4();
    const timestamp = Date.now();

    setToastsById((prevToastsById) => ({
      ...prevToastsById,
      [id]: {
        id,
        status,
        text,
        timeout,
        timestamp,
      },
    }));
  };

  const removeToast = (id: string) => {
    setToastsById((prevToastsById) => {
      const nextToastsById = { ...prevToastsById };
      delete nextToastsById[id];
      return nextToastsById;
    });
  };

  const toasts = Object.values(toastsById).sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return {
    addToast,
    removeToast,
    toasts,
  };
};

export default useToastmaster;
