import dayjs from 'dayjs';
import { DateSelection, ValueCount } from 'types';
import { onPromiseError } from 'utils';
import queryTraceService from './queryTraceService';

const traceColorsByServiceName = async (
  date?: DateSelection,
): Promise<ValueCount[]> => {
  const endTimeFormat = date ? dayjs.unix(date.endTimeUnix).format() : null;
  const durationSecs = date ? date.endTimeUnix - date.startTimeUnix : null;

  return queryTraceService<ValueCount[], 'labelValues'>(`
    {
      labelValues(
        ${durationSecs ? `durationSecs: ${durationSecs},` : ''}
        ${endTimeFormat ? `timestamp: "${endTimeFormat}",` : ''}
        labelName: "service_name",
      ) {
        value
      }
    }
  `).then((data) => data.labelValues || [], onPromiseError);
};

export default traceColorsByServiceName;
