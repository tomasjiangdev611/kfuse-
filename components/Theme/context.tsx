import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { createContext, ReactElement, useContext } from 'react';

const localStorageDarkModeKey = 'darkModeEnabled';
const localStorageUtcTimeKey = 'utcTimeEnabled';
const ThemeContext = createContext(null);

export const ThemeContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const darkModeToggle = useToggle(
    localStorage.getItem(localStorageDarkModeKey) === 'true',
  );

  const utcTimeToggle = useToggle(
    localStorage.getItem(localStorageUtcTimeKey) === 'true',
  );

  const toggleDarkMode = () => {
    localStorage.setItem(
      localStorageDarkModeKey,
      String(!darkModeToggle.value),
    );
    darkModeToggle.toggle();
  };

  const toggleUtcTime = () => {
    localStorage.setItem(localStorageUtcTimeKey, String(!utcTimeToggle.value));
    utcTimeToggle.toggle();
  };

  return (
    <ThemeContext.Provider
      value={{
        darkModeEnabled: darkModeToggle.value,
        toggleDarkMode,
        toggleUtcTime,
        utcTimeEnabled: utcTimeToggle.value,
      }}
    >
      <div
        className={classnames({
          theme: true,
          'theme--dark': darkModeToggle.value,
        })}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
