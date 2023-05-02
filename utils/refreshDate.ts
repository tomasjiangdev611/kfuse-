import { DateSelection } from 'types/DateSelection';
import { convertTimeStringToUnix } from './timeCodeToUnix';

export const refreshDate = (
  date: DateSelection,
  setDate: (nextState: DateSelection) => void,
): void => {
  const { startLabel, endLabel } = date;
  if (startLabel && endLabel) {
    const endTimeUnix = convertTimeStringToUnix(endLabel);
    const startTimeUnix = convertTimeStringToUnix(startLabel);
    if (endTimeUnix && startTimeUnix) {
      setDate({ ...date, endTimeUnix, startTimeUnix });
    }
    return;
  }

  setDate({ ...date });
};
