import classnames from 'classnames';
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PanelPosition, PanelState, PanelType } from 'types';
import { TooltipPosition } from './types';
import Panel from '../Panel';

type State = {
  height: number;
  width: number;
  top: number;
  left: number;
};

type Props = {
  children: ReactNode;
  className?: string;
  disable?: boolean;
  offsetX?: number;
  offsetY?: number;
  position?: PanelPosition;
  tooltip:
    | ReactNode
    | (({
        close,
        state,
      }: {
        close: VoidFunction;
        state: PanelState;
      }) => ReactNode);
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const TooltipTrigger = ({
  children,
  className,
  disable,
  offsetX = 0,
  offsetY = 0,
  position = TooltipPosition.TOP,
  style,
  tooltip,
}: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [state, setState] = useState<State>(null);
  const showTooltip = !disable && state;

  const onMouseEnter = () => {
    const showTooltip = () => {
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

    timeoutRef.current = setTimeout(showTooltip, 200);
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
        'tooltip-trigger': true,
        'tooltip-trigger--active': showTooltip,
        [className]: className,
      })}
      onMouseEnter={onMouseEnter}
      ref={elementRef}
      style={style}
    >
      {children}
      {showTooltip ? (
        <Panel
          close={close}
          elementRef={elementRef}
          panel={
            typeof tooltip === 'function' ? tooltip({ close, state }) : tooltip
          }
          position={position}
          state={state}
          type={PanelType.tooltip}
        />
      ) : null}
    </div>
  );
};

export default TooltipTrigger;
