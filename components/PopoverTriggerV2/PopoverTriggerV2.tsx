import classnames from 'classnames';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import PopoverTriggerV2Popover from './PopoverTriggerV2Popover';
import { PopoverPosition } from './types';

const CONTAINER_BUFFER = 4;
const CONTAINER_HEIGHT = 200;
const CONTAINER_WIDTH = 400;

type State = {
  height: number;
  width: number;
  top: number;
  left: number;
};

const getStyle = (position: PopoverPosition, state: State) => {
  const { left, height, width, top } = state;
  switch (position) {
    case PopoverPosition.BOTTOM_LEFT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top + height + CONTAINER_BUFFER}px`,
        left: `${left}px`,
      };

    case PopoverPosition.BOTTOM_RIGHT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top + height + CONTAINER_BUFFER}px`,
        left: `${left - (CONTAINER_WIDTH - width)}px`,
      };

    case PopoverPosition.LEFT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top + height / 2 - CONTAINER_HEIGHT / 2}px`,
        left: `${left - CONTAINER_WIDTH - CONTAINER_BUFFER}px`,
      };

    case PopoverPosition.TOP:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top - CONTAINER_HEIGHT - CONTAINER_BUFFER}px`,
        left: `${left + width / 2 - CONTAINER_WIDTH / 2}px`,
      };

    case PopoverPosition.TOP_LEFT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top - CONTAINER_HEIGHT - CONTAINER_BUFFER}px`,
        left: `${left}px`,
      };

    case PopoverPosition.TOP_RIGHT:
      return {
        height: `${CONTAINER_HEIGHT}px`,
        width: `${CONTAINER_WIDTH}px`,
        top: `${top - CONTAINER_HEIGHT - CONTAINER_BUFFER}px`,
        left: `${left - (CONTAINER_WIDTH - width)}px`,
      };

    default:
      return {};
  }
};

type Props = {
  children:
    | ReactNode
    | ((args: { close: VoidFunction; isOpen: boolean }) => ReactNode);
  className?: string;
  disable?: boolean;
  forceOpen?: boolean;
  offsetX?: number;
  offsetY?: number;
  onClose?: VoidFunction;
  position?: PopoverPosition;
  popover: (args: { close: VoidFunction }) => ReactNode;
  shouldStopMouseDownPropagation?: boolean;
  shouldUseClickOnOutsideClick?: boolean;
};

export const PopoverTriggerV2 = ({
  children,
  className,
  disable,
  forceOpen,
  onClose,
  offsetX = 0,
  offsetY = 0,
  popover,
  position = PopoverPosition.TOP,
  shouldStopMouseDownPropagation,
  shouldUseClickOnOutsideClick,
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [state, setState] = useState<State>(null);
  const isOpen = !disable && Boolean(state);

  const onClick = () => {
    const element = elementRef.current;
    if (element) {
      const { offsetHeight, offsetWidth } = element;
      const { top, left } = element.getBoundingClientRect();

      setState({
        height: offsetHeight,
        left: left + offsetX,
        top: top + offsetY,
        width: offsetWidth,
      });
    }
  };

  const onMouseDown = (e) => {
    if (shouldStopMouseDownPropagation) {
      e.stopPropagation();
    }
  };

  const close = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setState(null);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className={classnames({
        'popover-trigger-v2': true,
        'popover-trigger-v2--open': isOpen,
        [className]: className,
      })}
      ref={elementRef}
    >
      <div
        className="popover-trigger-v2__target"
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        {typeof children === 'function'
          ? children({ close, isOpen })
          : children}
      </div>
      {isOpen || forceOpen ? (
        <PopoverTriggerV2Popover
          close={close}
          elementRef={elementRef}
          onClose={onClose}
          popover={popover}
          position={position}
          shouldUseClickOnOutsideClick={shouldUseClickOnOutsideClick}
          style={getStyle(position, state)}
        />
      ) : null}
    </div>
  );
};

export default PopoverTriggerV2;
