import dayjs from 'dayjs';
import { DateSelection, TimeSeries } from 'types';
import { msIntervalByResolution, onPromiseError, transformLogQL } from 'utils';

import query from './query';
import { formatLogsTimeseriesDataset } from './utils';

type Args = {
  date: DateSelection;
  logQL?: string;
  width?: number;
};

const getLogMetricsTimeSeriesLogQL = async ({
  date,
  logQL,
  width,
}: Args): Promise<any> => {
  const { startTimeUnix, endTimeUnix } = date;
  const endTime = dayjs.unix(endTimeUnix);
  const durationSecs = endTimeUnix - startTimeUnix;
  const durationMs = durationSecs * 1000;
  const stepMs = msIntervalByResolution(date, width);

  const logQLSanitized = transformLogQL(logQL, date, width);
  return query<TimeSeries[], 'getLogMetricsTimeSeries'>(`
    {
      getLogMetricsTimeSeries(
        durationMs: ${durationMs},
        ${logQL ? `logQL: "${logQLSanitized}",` : ''}
        stepMs: ${stepMs}
        timestamp: "${endTime.format()}"
      ) {
        points {
          ts
          value
        }
        tags
      }
    }
  `).then(
    (data) =>
      formatLogsTimeseriesDataset([
        { dataset: data.getLogMetricsTimeSeries },
      ]) || [],
    onPromiseError,
  );
};

export default getLogMetricsTimeSeriesLogQL;
