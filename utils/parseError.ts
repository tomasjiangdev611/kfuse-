/**
 * Parse server error to human readable message
 * @param error
 * @returns string
 */
export const parseError = (error: Error): string => {
  if (typeof error === 'string') {
    return error;
  } else if (typeof error.message === 'string') {
    return error.message;
  } else if (Array.isArray(error)) {
    return parseError(error[0]);
  } else {
    return 'Failed to load the data.';
  }
};
