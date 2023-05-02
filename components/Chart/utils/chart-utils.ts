import uPlot from 'uplot';

type OptionsUpdateState = 'keep' | 'update' | 'create';
export const chartTypesPredefined = ['Line', 'Bar', 'Stacked Bar', 'Area'];
export const strokeTypesPredefined = ['normal', 'thick', 'thin', 'none'];

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
if (!Object.is) {
  // eslint-disable-next-line
  Object.defineProperty(Object, 'is', {
    value: (x: any, y: any) =>
      (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y),
  });
}

export const optionsUpdateState = (
  _lhs: uPlot.Options,
  _rhs: uPlot.Options,
): OptionsUpdateState => {
  const { width: lhsWidth, height: lhsHeight, ...lhs } = _lhs;
  const { width: rhsWidth, height: rhsHeight, ...rhs } = _rhs;

  let state: OptionsUpdateState = 'keep';
  if (lhsHeight !== rhsHeight || lhsWidth !== rhsWidth) {
    state = 'update';
  }
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return 'create';
  }
  for (const k of Object.keys(lhs)) {
    if (!Object.is(lhs[k], rhs[k])) {
      state = 'create';
      break;
    }
  }
  return state;
};

export const dataMatch = (
  lhs: uPlot.AlignedData,
  rhs: uPlot.AlignedData,
): boolean => {
  if (lhs.length !== rhs.length) {
    return false;
  }
  return lhs.every((lhsOneSeries, seriesIdx) => {
    const rhsOneSeries = rhs[seriesIdx];
    if (lhsOneSeries.length !== rhsOneSeries.length) {
      return false;
    }
    return lhsOneSeries.every(
      (value, valueIdx) => value === rhsOneSeries[valueIdx],
    );
  });
};

export function mapMouseEventToMode(event: React.MouseEvent): string {
  if (event.ctrlKey || event.metaKey || event.shiftKey) {
    return 'append';
  }
  return 'select';
}

/**
 * Find max value series data
 * @param param0 [1661950233398, null, null, null, null, null]
 * @returns find max value in array
 * @example [1661950233398, null, null, null, null, null] => 1661950233398
 */
export const findMaxValueInSeries = (data: any[]) => {
  const maxValue = data.reduce((acc, curr) => {
    if (curr !== null && curr > acc) {
      return curr;
    }
    return acc;
  }, 0);
  return maxValue;
};
