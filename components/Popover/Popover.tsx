import React, { ReactElement } from 'react';
import { usePopoverContext } from './context';
import PopoverPanel from './PopoverPanel';

const Popover = (): ReactElement => {
  const {
    close,
    component,
    coordinates,
    onClose,
    popoverPanelClassName,
    props,
  } = usePopoverContext();

  if (component) {
    return (
      <div className="popover">
        <button className="popover__bg" onClick={close} />
        <PopoverPanel
          close={close}
          component={component}
          coordinates={coordinates}
          onClose={onClose}
          popoverPanelClassName={popoverPanelClassName}
          props={props}
        />
      </div>
    );
  }

  return null;
};

export default Popover;
