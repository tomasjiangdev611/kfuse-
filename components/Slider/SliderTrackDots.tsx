import React from 'react';

const SliderTrackDots = ({ dots, slider }) => {
  const { min, max, step, width } = slider;
  const stepCount = Math.floor((max - min) / step);
  const result = [];

  dots.forEach((dotValue, i) => {
    const percentage = parseInt(dotValue, 10) / max * 100;
    result.push(
      <div className="slider__track__dots__section" style={{ width: `${percentage}%` }}>
        <div className="slider__track__dots__section__dot" />
      </div>,
    );
  });

  return <div className="slider__track__dots">{result}</div>;
};

export default SliderTrackDots;
