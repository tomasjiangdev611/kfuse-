import classnames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import React, { ReactNode, useRef, useState } from 'react';

type State = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

type Props = {
  children: (state: State) => ReactNode;
  className?: string;
};

const SizeObserver = ({ children, className }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
  });

  const onResize = () => {
    const element = elementRef.current;
    if (element) {
      const viewportOffset = element.getBoundingClientRect();
      const { offsetHeight, offsetWidth } = element;
      setState({
        height: offsetHeight,
        offsetX: viewportOffset.left,
        offsetY: viewportOffset.top,
        width: offsetWidth,
      });
    }
  };

  return (
    <ResizeObserver onResize={onResize}>
      <div className={classnames({ [className]: className })} ref={elementRef}>
        {children(state)}
      </div>
    </ResizeObserver>
  );
};

export default SizeObserver;
