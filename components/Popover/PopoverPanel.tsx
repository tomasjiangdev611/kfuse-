import React, { ReactElement, useEffect } from 'react';
import { PopoverCoordinates } from './types';

const stopPropagation = (e) => {
  e.stopPropagation();
};

type Props = {
  component: ReactElement;
  coordinates: PopoverCoordinates;
  close: () => void;
  onClose: () => void;
  popoverPanelClassName?: string;
  props: any;
};

const PopoverPanel = ({
  component: Component,
  coordinates,
  close,
  onClose = () => {},
  popoverPanelClassName = '',
  props,
}: Props): ReactElement => {

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  return (
    <div
      className={`${popoverPanelClassName} popover__panel`}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
      style={{
        transform: `translate3d(${coordinates.left}px, ${coordinates.top}px, 0)`,
        width: coordinates.width ? `${coordinates.width}px` : 'auto',
      }}
    >
      <Component {...props} close={close} />
    </div>
  );
};

export default PopoverPanel;
