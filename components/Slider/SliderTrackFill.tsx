import React from "react";

const SliderTrackFill = ({ slider }) => {
  const { sliderPercentage } = slider;
  return (
    <div
      className="slider__track__fill"
      style={{ width: `${sliderPercentage}%` }}
    />
  );
};

export default SliderTrackFill;
