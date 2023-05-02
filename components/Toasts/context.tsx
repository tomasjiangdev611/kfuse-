import React, { createContext, Context, useContext, ReactElement } from 'react';

import { ToastContextProps } from './types';
import useToastmaster from './useToastmaster';

const ToastmasterContext: Context<ToastContextProps> = createContext(null);

export const ToastmasterContextProvider = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const toastmaster = useToastmaster();

  return (
    <ToastmasterContext.Provider value={toastmaster}>
      {children}
    </ToastmasterContext.Provider>
  );
};

export const useToastmasterContext = () => useContext(ToastmasterContext);
