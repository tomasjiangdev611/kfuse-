import classnames from 'classnames';
import { useOnClickOutside } from 'hooks';
import React, { MutableRefObject, ReactNode } from 'react';
import { PopoverPosition } from './types';

type Props = {
  close: VoidFunction;
  elementRef: MutableRefObject<HTMLDivElement>;
  onClose: VoidFunction;
  popover: (args: { close: VoidFunction }) => ReactNode;
  position: PopoverPosition;
  shouldUseClickOnOutsideClick?: boolean;
  style: { [key: string]: string };
};

const PopoverTriggerV2Popover = ({
  close,
  elementRef,
  onClose,
  popover,
  position,
  shouldUseClickOnOutsideClick,
  style,
}: Props) => {
  const onOutsideClick = () => {
    if (onClose) {
      onClose();
    }

    close();
  };

  useOnClickOutside({
    onClick: onOutsideClick,
    ref: elementRef,
    shouldUseClick: shouldUseClickOnOutsideClick,
  });

  return (
    <div
      className={classnames({
        'popover-trigger-v2__popover': true,
        [`popover-trigger-v2__popover--${position}`]: true,
      })}
      style={style}
    >
      <div className="popover-trigger-v2__popover__content">
        {popover({ close })}
      </div>
    </div>
  );
};

export default PopoverTriggerV2Popover;
