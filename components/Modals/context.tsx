import React, { createContext, useContext } from 'react';
import useModals from './useModals';

const ModalsContext = createContext(null);

export const ModalsContextProvider = ({ children }) => {
  const modals = useModals();
  return (
    <ModalsContext.Provider value={modals}>{children}</ModalsContext.Provider>
  );
};

export const useModalsContext = () => useContext(ModalsContext);
