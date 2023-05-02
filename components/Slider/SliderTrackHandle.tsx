import classnames from 'classnames';
import { useSlider } from 'components';
import { useMouseMover, MouseMoverCoordinates } from 'hooks';
import React, { ReactElement, ReactNode } from 'react';

type Props = {
  onMouseDown: () => void;
  slider: ReturnType<typeof useSlider>;
  tooltip: ReactNode;
};

const SliderTrackHandle = ({
  onMouseDown,
  slider,
  tooltip,
}: Props): ReactElement => {
  const { onSliderHandleMouseMove, onSliderHandleMouseUp, sliderPercentage } =
    slider;

  const onMouseMove = ({ deltaX }: MouseMoverCoordinates) => {
    onSliderHandleMouseMove(deltaX);
  };

  const mouseMover = useMouseMover({
    onMouseMove,
    onMouseUp: onSliderHandleMouseUp,
  });
  return (
    <div
      className="slider__track__handle"
      style={{ width: `${sliderPercentage}%` }}
    >
      <div
        className="slider__track__handle__button"
        onMouseDown={(e) => {
          mouseMover.onMouseDown(e);
          onMouseDown();
        }}
      >
        {tooltip ? (
          <div
            className={classnames({
              slider__track__handle__button__tooltip: true,
              'slider__track__handle__button__tooltip--left':
                sliderPercentage < 5,
              'slider__track__handle__button__tooltip--right':
                sliderPercentage > 95,
            })}
          >
            <div className="slider__track__handle__button__tooltip__text">
              {tooltip}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SliderTrackHandle;
