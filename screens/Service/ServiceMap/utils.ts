import { DateSelection } from 'types';

export const getTimeParameter = (date: DateSelection) => {
  const { endTimeUnix, startTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;
  return `${diffInSeconds}s`;
};
