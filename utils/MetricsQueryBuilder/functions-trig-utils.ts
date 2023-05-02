export const TRIGONOMETRIC_FUNCTIONS = [
  'acos',
  'acosh',
  'asin',
  'asinh',
  'atan',
  'atanh',
  'cos',
  'cosh',
  'sin',
  'sinh',
  'tan',
  'tanh',
];

export const getTrigonometricPromQL = (name: string, query: string): string => {
  return `${name}(${query})`;
};
