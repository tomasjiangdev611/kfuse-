export const addCommas = (i) => {
  if (i === null || Number.isNaN(i)) {
    return i;
  }

  return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

export default clamp;
