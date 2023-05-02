const findAverage = (numbers: number[]): number => {
  const average = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  if (average >= 1) {
    return Math.round(average);
  }

  return Number(average.toFixed(2));
};

export default findAverage;
