import React, { useRef } from 'react';
import ResizeObserver from 'rc-resize-observer';
import SliderTrack from './SliderTrack';
import useSlider from './useSlider';

const Slider = ({
  dots = [],
  onChange,
  onMouseDown = () => {},
  max,
  min,
  step,
  tooltip = '',
  value,
}) => {
  const ref = useRef(null);
  const slider = useSlider({ onChange, min, max, step, value });
  const { setWidth } = slider;

  const onResize = () => {
    if (ref.current) {
      const { offsetWidth } = ref.current;
      setWidth(offsetWidth);
    }
  };

  return (
    <ResizeObserver onResize={onResize}>
      <div className="slider" ref={ref}>
        <SliderTrack
          dots={dots}
          onMouseDown={onMouseDown}
          slider={slider}
          tooltip={tooltip}
        />
      </div>
    </ResizeObserver>
  );
};

export default Slider;
