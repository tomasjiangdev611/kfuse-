import React, { createContext, useContext } from 'react';

const ServiceMapStateContext = createContext(null);
export const useServiceMapStateContext = () =>
  useContext(ServiceMapStateContext);

export const ServiceMapStateContextProvider = ({
  children,
  serviceMapState,
}) => {
  return (
    <ServiceMapStateContext.Provider value={serviceMapState}>
      {children}
    </ServiceMapStateContext.Provider>
  );
};
