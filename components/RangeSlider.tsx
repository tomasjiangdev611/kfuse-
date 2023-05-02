import { useMouseMover } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Input } from './Input';

type Value = { lower: number; upper: number };

type Props = {
  onChange: (value: Value) => void;
  min: number;
  max: number;
  value: Value;
};

const RangeSlider = ({ max, min, onChange, value }: Props) => {
  const { lower, upper } = value;

  const onChangeLower = (value: number) => {
    const nextLower = Math.min(value, upper);
    const nextUpper = Math.max(value, upper);

    onChange({ lower: nextLower, upper: nextUpper });
  };

  const onChangeUpper = (value: number) => {
    const nextLower = Math.min(value, lower);
    const nextUpper = Math.max(value, lower);

    onChange({ lower: nextLower, upper: nextUpper });
  };

  const onChangeSliderLower = (value: number) => {
    setState((prevState) => {
      const nextLower = Math.min(value, prevState.upper);
      const nextUpper = Math.max(value, prevState.upper);
      return {
        ...prevState,
        lower: nextLower,
        upper: nextUpper,
      };
    });
  };

  const onChangeSliderUpper = (value: number) => {
    setState((prevState) => {
      const nextLower = Math.min(value, prevState.lower);
      const nextUpper = Math.max(value, prevState.lower);
      return {
        ...prevState,
        lower: nextLower,
        upper: nextUpper,
      };
    });
  };

  const [state, setState] = useState({ isDragging: false, lower, upper });

  const onSliderMouseDown = () => {
    setState({ isDragging: true, lower, upper });
  };

  const onSliderMouseUp = () => {
    setState((prevState) => {
      onChange({ lower: prevState.lower, upper: prevState.upper });
      return {
        ...prevState,
        isDragging: false,
      };
    });
  };

  const mouseMover = useMouseMover({
    onMouseDown: onSliderMouseDown,
    onMouseUp: onSliderMouseUp,
  });

  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <div className="range-slider">
      <div className="range-slider__inputs">
        <Input
          className="range-slider__inputs__item"
          onBlur={onSliderMouseUp}
          onChange={onChangeSliderLower}
          type="number"
          value={state.lower}
        />
        <div className="range-slider__inputs__label">To</div>
        <Input
          className="range-slider__inputs__item"
          onBlur={onSliderMouseUp}
          onChange={onChangeSliderUpper}
          type="number"
          value={state.upper}
        />
      </div>
      <div className="range-slider__slider">
        <Input
          className="range-slider__slider__input"
          min={min}
          max={max}
          onChange={onChangeSliderLower}
          onMouseDown={mouseMover.onMouseDown}
          type="range"
          value={state.lower}
        />
        <Input
          className="range-slider__slider__input"
          min={min}
          max={max}
          onChange={onChangeSliderUpper}
          onMouseDown={mouseMover.onMouseDown}
          type="range"
          value={state.upper}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
