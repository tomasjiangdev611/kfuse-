import React, { useLayoutEffect, useRef, useState } from 'react';
import ResizeObserver from 'rc-resize-observer';
import D3Chart from './D3Chart';

const D3 = (props) => {
  const ref = useRef(null);
  const [state, setState] = useState(null);

  const onResize = () => {
    if (ref.current) {
      const { offsetHeight, offsetWidth } = ref.current;
      setState({
        height: offsetHeight,
        width: offsetWidth,
      });
    }
  };

  useLayoutEffect(() => {
    onResize();
  }, []);

  return (
    <ResizeObserver onResize={onResize}>
      <div className="d3" ref={ref} style={{ height: '100%', width: '100%' }}>
        {state && (
          <D3Chart
            {...props}
            element={ref.current}
            height={state.height}
            width={state.width}
          />
        )}
      </div>
    </ResizeObserver>
  );
};

export default D3;
