export const percentageCalculator = (
  value: number,
  totalValue: number,
): number => {
  return Math.floor((value / totalValue) * 100);
};
