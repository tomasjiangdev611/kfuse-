import { DateSelection } from 'types';

export const getPromQLTimeParameter = (date: DateSelection) => {
  const { endTimeUnix, startTimeUnix } = date;
  const diffInSeconds = endTimeUnix - startTimeUnix;
  return `${diffInSeconds}s`;
};
