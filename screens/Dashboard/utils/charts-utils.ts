import { DateSelection } from 'types/DateSelection';
import uPlot from 'uplot';

export const setDateRangeOnChartZoom = (u: uPlot, setDate: any) => {
  if (u.select.width > 0) {
    const min = u.posToVal(u.select.left, 'x');
    const max = u.posToVal(u.select.left + u.select.width, 'x');

    const date: DateSelection = {
      startTimeUnix: parseInt(min.toString()),
      endTimeUnix: parseInt(max.toString()),
    };

    setDate(date);
  }
};
