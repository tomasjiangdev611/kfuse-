import classnames from 'classnames';
import { useToggle } from 'hooks';
import React, { ReactElement, ReactNode, useRef } from 'react';
import { isLeftClick } from 'utils';
import { usePopoverContext } from './context';

type Props = {
  children: ReactNode;
  className?: string;
  component: ReactElement;
  popoverPanelClassName?: string;
  props: any;
  right?: boolean;
  width?: number;
};

const defaultPopoverPanelWidth = 240;

const PopoverTrigger = ({
  children,
  className,
  component,
  popoverPanelClassName,
  props,
  right,
  width = defaultPopoverPanelWidth,
}: Props): ReactElement => {
  const openToggle = useToggle();
  const popoover = usePopoverContext();
  const ref = useRef(null);

  const onClick = (e: Event) => {
    if (isLeftClick(e)) {
      const element = ref.current;
      if (element) {
        openToggle.on();
        popoover.open({
          component,
          element,
          onClose: openToggle.off,
          popoverPanelClassName,
          props,
          right,
          width,
        });
      }
    }
  };

  return (
    <button
      className={classnames({
        'popover-trigger': true,
        'popover-trigger--open': openToggle.value,
        [className]: className,
      })}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
};

export default PopoverTrigger;
