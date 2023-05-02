import React, { ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
};

const CursorTooltip = ({ children }: Props) => {
  const elementRef = useRef(null);
  const [state, setState] = useState(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      const element = elementRef.current;
      if (element) {
        const { clientX, clientY } = e;

        setState({
          clientX,
          clientY,
          width: element.offsetWidth,
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
        });
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const style = state
    ? {
        transform: `translate3d(${state.clientX + 18}px, ${
          state.clientY - 4
        }px, 0)`,
      }
    : { opacity: 0 };

  return (
    <div className="cursor-tooltip" ref={elementRef} style={style}>
      {children}
    </div>
  );
};

export default CursorTooltip;
