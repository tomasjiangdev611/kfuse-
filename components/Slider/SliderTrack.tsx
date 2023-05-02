import React, { useLayoutEffect, useRef } from 'react';
import SliderTrackFill from './SliderTrackFill';
import SliderTrackDots from './SliderTrackDots';
import SliderTrackHandle from './SliderTrackHandle';

const SliderTrack = ({ dots, onMouseDown, slider, tooltip }) => {
  const ref = useRef(null);
  const { setWidth, width } = slider;

  useLayoutEffect(() => {
    const onResize = () => {
      setWidth(ref.current.getBoundingClientRect().width);
    };

    onResize();

    window.addEventListener('resize', onResize, false);

    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, []);

  return (
    <div className="slider__track" ref={ref}>
      {width && (
        <div className="slider__track__inner">
          <SliderTrackFill slider={slider} />
          <SliderTrackDots dots={dots} slider={slider} />
          <SliderTrackHandle
            onMouseDown={onMouseDown}
            slider={slider}
            tooltip={tooltip}
          />
        </div>
      )}
    </div>
  );
};

export default SliderTrack;
