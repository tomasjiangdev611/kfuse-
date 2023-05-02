import { PopoverCoordinates } from './types';

type Args = {
  customWidth?: number;
  element: HTMLElement;
  right?: boolean;
};

const getCoordinates = ({
  customWidth,
  element,
  right,
}: Args): PopoverCoordinates => {
  const { offsetHeight, offsetWidth } = element;
  const width = customWidth ? customWidth : Math.max(offsetWidth, 240);
  const { left, top } = element.getBoundingClientRect();

  const calculatedLeft = right ? left + offsetWidth - width : left;
  const calculatedTop = top + offsetHeight;

  return {
    left: calculatedLeft,
    top: calculatedTop,
    width: customWidth || null,
  };
};

export default getCoordinates;
