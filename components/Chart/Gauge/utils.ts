/**
 * Build grid based on number items
 * @param items
 * @example 4 items will return 2x2 grid
 * @example 5 items will return 3x2 grid
 * @example 9 items will return 3x3 grid
 * @example 10 items will return 4x3 grid
 * return {cols, rows}
 */
export const getGaugeGrid = (items: number): { cols: number; rows: number } => {
  const cols = Math.ceil(Math.sqrt(items));
  const rows = Math.ceil(items / cols);
  return { cols, rows };
};

/**
 * get last not null value from array
 * Going from right to left
 */
export const getLastValue = (data: any[]): number => {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] !== null) {
      return data[i];
    }
  }
};
