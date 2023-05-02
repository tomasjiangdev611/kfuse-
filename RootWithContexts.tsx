import { ThemeContextProvider, ToastmasterContextProvider } from 'components';
import React from 'react';
import Root from './Root';

const RootWithContexts = () => {
  return (
    <ThemeContextProvider>
      <ToastmasterContextProvider>
        <Root />
      </ToastmasterContextProvider>
    </ThemeContextProvider>
  );
};

export default RootWithContexts;
