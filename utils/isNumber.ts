/**
 * Check value is a number
 * @param val
 * @returns boolean
 */
const isNumber = (val: any): boolean => {
  return (typeof val === 'number' || typeof val === 'string') && !isNaN(val);
};

export default isNumber;
