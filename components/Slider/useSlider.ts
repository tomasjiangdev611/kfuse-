import { useRef, useState } from 'react';
import { calcSliderPercentage, clamp } from './utils';

const useAmount = ({ onChange, min, max, step, value }) => {
  const [width, setWidth] = useState(0);
  const valueRef = useRef(value);

  const onSliderHandleMouseMove = (deltaX) => {
    const prevValue = valueRef.current;
    const nextValue = clamp(
      Math.round(prevValue + (deltaX / width) * (max - min)),
      min,
      max,
    );

    valueRef.current = nextValue;
    onChange(Math.floor((nextValue - min) / step) * step + min);
  };

  const onSliderHandleMouseUp = () => {
    const prevValue = valueRef.current;
    const currentStep = Math.floor((prevValue - min) / step);
    const modulo = (prevValue - min) % step;
    const nextStep = modulo > step / 2 ? currentStep + 1 : currentStep;
    const nextValue = nextStep * step + min;

    valueRef.current = nextValue;
    onChange(nextValue);
  };

  return {
    min,
    max,
    onSliderHandleMouseMove,
    onSliderHandleMouseUp,
    setWidth,
    sliderPercentage: calcSliderPercentage(value, min, max),
    step,
    width,
    value,
  };
};

export default useAmount;
