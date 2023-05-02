const roundNumber = (number: number): number => {
  if (typeof number === 'number') {
    if (number >= 1) {
      return Math.round(number);
    }

    return Number(number.toFixed(2));
  }

  return number;
};

export default roundNumber;
