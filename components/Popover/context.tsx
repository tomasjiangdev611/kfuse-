import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';
import usePopover from './usePopover';

const PopoverContext = createContext(null);

type Props = {
  children: ReactNode;
};

export const PopoverContextProvider = ({ children }: Props): ReactElement => {
  const popover = usePopover();
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
};

export const usePopoverContext = (): ReturnType<typeof usePopover> =>
  useContext(PopoverContext);
