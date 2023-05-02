import { DateSelection } from 'types';

type Args = {
  date: DateSelection;
  width: number;
};

const pixelsPerBar = 10;

const calcStepSize = ({ date, width }: Args): string => {
  const { startTimeUnix, endTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;
  const numOfBars = Math.floor(width / pixelsPerBar);
  return `${Math.floor(diffInSeconds / numOfBars)}s`;
};

export default calcStepSize;
