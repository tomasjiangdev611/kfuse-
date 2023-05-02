import { ReactElement, useEffect, useState } from 'react';
import getCoordinates from './getCoordinates';
import { PopoverCoordinates } from './types';

type OpenArgs = {
  component: ReactElement;
  element: HTMLElement;
  onClose?: () => void;
  popoverPanelClassName?: string;
  props: any;
  right?: boolean;
  width?: number;
};

type State = {
  component: ReactElement;
  coordinates: PopoverCoordinates;
  onClose?: () => void;
  popoverPanelClassName?: string;
  props: any;
};

type Result = State & {
  close: () => void;
  open: (args: OpenArgs) => void;
};

const usePopover = (): Result => {
  const [state, setState] = useState<State>({
    component: null,
    coordinates: { top: 0, left: 0, width: 0 },
    props: {},
  });

  const close = () => {
    setState({
      component: null,
      coordinates: { top: 0, left: 0, width: 0 },
      props: {},
    });
  };

  const open = ({
    component,
    element,
    onClose,
    popoverPanelClassName,
    props,
    right,
    width,
  }: OpenArgs) => {
    const coordinates = getCoordinates({ customWidth: width, element, right });

    setState({
      component,
      coordinates,
      onClose,
      popoverPanelClassName,
      props,
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return {
    ...state,
    close,
    open,
  };
};

export default usePopover;
